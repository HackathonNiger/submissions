import logging
import asyncio
from typing import Dict, List, Any, Optional, Union, Tuple, Set
from enum import Enum
from dataclasses import dataclass, field
import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import re
from collections import defaultdict
import math
import itertools
import requests
import time

from dotenv import load_dotenv
load_dotenv()

from pydantic import Field, BaseModel, validator
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import trim_messages
from langchain.tools.retriever import create_retriever_tool
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema import Document
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
from langchain_core.tools import tool
from langchain_core.prompts import PromptTemplate

from aiq.builder.builder import Builder
from aiq.builder.framework_enum import LLMFrameworkEnum
from aiq.builder.function_info import FunctionInfo
from aiq.cli.register_workflow import register_function
from aiq.data_models.component_ref import EmbedderRef, FunctionRef, LLMRef
from aiq.data_models.function import FunctionBaseConfig
from aiq.data_models.api_server import AIQChatRequest, AIQChatResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

logger = logging.getLogger(__name__)

# Load and process the career guide data
def load_career_data():
    """Load the Nigeria career guide CSV data"""
    try:
        # Get the directory of the current script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        
        # Try different possible paths - fixed and expanded
        possible_paths = [
            'nigeria_career_guide.csv',  # Current working directory
            os.path.join(current_dir, 'nigeria_career_guide.csv'),  # Same dir as script
            os.path.join(project_root, 'nigeria_career_guide.csv'),  # Project root
            os.path.join(project_root, 'data', 'nigeria_career_guide.csv'),  # data folder
            os.path.join('data', 'nigeria_career_guide.csv'),  # relative data folder
            os.path.join('nigeria_pathwise', 'nigeria_career_guide.csv'),
            os.path.join('nigeria_pathwise', 'data', 'nigeria_career_guide.csv'),
            os.path.join('..', 'nigeria_career_guide.csv'),  # parent directory
            os.path.join('nigeria_pathwise', 'src', 'nigeria_pathwise', 'nigeria_career_guide.csv')
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                df = pd.read_csv(path)
                logger.info(f"Successfully loaded career data from: {path}")
                logger.info(f"Data shape: {df.shape}")
                logger.info(f"Columns: {list(df.columns)}")
                return df
        
        logger.warning("Career guide CSV not found in any of the expected locations.")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"Script directory: {current_dir}")
        logger.info(f"Project root: {project_root}")
        logger.info(f"Tried paths: {possible_paths}")
        
        # Create a sample dataset if file not found
        logger.info("Creating sample career data...")
        return create_sample_career_data()
        
    except Exception as e:
        logger.error(f"Error loading career data: {e}")
        return create_sample_career_data()

def create_sample_career_data():
    """Create sample career data for demonstration purposes"""
    sample_data = {
        'degree_program': [
            'Computer Science', 'Computer Science', 'Computer Science',
            'Business Administration', 'Business Administration', 'Business Administration',
            'Engineering', 'Engineering', 'Engineering',
            'Medicine', 'Medicine', 'Law', 'Law',
            'Economics', 'Economics', 'Mass Communication'
        ],
        'job_role': [
            'Software Developer', 'Data Scientist', 'Cybersecurity Analyst',
            'Project Manager', 'Business Analyst', 'Marketing Manager',
            'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer',
            'Medical Doctor', 'Pharmacist', 'Corporate Lawyer', 'Legal Advisor',
            'Financial Analyst', 'Investment Banker', 'Media Producer'
        ],
        'key_industries': [
            'Technology, Fintech, Software', 'Technology, Finance, Healthcare',
            'Banking, Technology, Government', 'Construction, Technology, Healthcare',
            'Banking, Consulting, Technology', 'Advertising, FMCG, Technology',
            'Construction, Infrastructure, Real Estate', 'Manufacturing, Oil & Gas, Automotive',
            'Power, Telecommunications, Manufacturing', 'Healthcare, Pharmaceuticals',
            'Healthcare, Pharmaceuticals, Retail', 'Corporate, Banking, Real Estate',
            'Corporate, Government, NGO', 'Banking, Investment, Insurance',
            'Banking, Investment, Private Equity', 'Media, Entertainment, Advertising'
        ],
        'top_skills_required': [
            'Python, JavaScript, SQL, Problem-solving, Teamwork',
            'Python, SQL, Machine Learning, Statistics, Communication',
            'Network Security, Risk Assessment, Python, Communication, Attention to Detail',
            'Project Management, Leadership, Communication, Microsoft Office, Risk Management',
            'Data Analysis, SQL, Excel, Problem-solving, Communication',
            'Digital Marketing, Communication, Creativity, Analytics, Strategic Thinking',
            'AutoCAD, Project Management, Mathematics, Problem-solving, Communication',
            'CAD Software, Mathematics, Problem-solving, Project Management, Teamwork',
            'Circuit Design, MATLAB, Problem-solving, Mathematics, Communication',
            'Medical Knowledge, Communication, Empathy, Problem-solving, Attention to Detail',
            'Pharmaceutical Knowledge, Attention to Detail, Communication, Chemistry, Patient Care',
            'Legal Research, Communication, Analytical Thinking, Negotiation, Writing',
            'Legal Knowledge, Communication, Research, Writing, Analytical Thinking',
            'Financial Analysis, Excel, Communication, Analytical Thinking, Attention to Detail',
            'Financial Modeling, Excel, Communication, Analytical Thinking, Risk Assessment',
            'Creative Writing, Communication, Video Production, Project Management, Creativity'
        ]
    }
    
    df = pd.DataFrame(sample_data)
    logger.info(f"Created sample dataset with {len(df)} records")
    return df

# Initialize career data
CAREER_DATA = load_career_data()

class NigeriaPathwiseFunctionConfig(FunctionBaseConfig, name="nigeria_pathwise"):
    """
    AI-Powered Career Guidance and Path Planning Assistant
    """
    llm_name: str = Field(description="Name of the LLM to use")
    embedder_name: str = Field(description="Name of the embedder to use")
    tool_names: List[str] = Field(default=[], description="List of tool names to include")
    ingest_glob: str = Field(default="data/career_resources/*.{pdf,txt,docx,csv,xlsx}", description="Glob pattern for ingesting documents")
    chunk_size: int = Field(default=1024, description="Chunk size for document splitting")
    description: str = Field(default="AI-Powered Career Guidance and Path Planning Assistant")
    max_history: int = Field(default=20, description="Maximum conversation history")
    personality: str = Field(default="mentor", description="AI personality: mentor, professional, casual")
    search_engine: str = Field(default="bing", description="Search engine to use for resource gathering")

@tool
def search_career_opportunities(degree_program: str) -> str:
    """
    Search for career opportunities based on degree program
    
    Args:
        degree_program: The degree program to search for (e.g., "Computer Science", "Business Administration")
    
    Returns:
        Formatted string with career opportunities
    """
    if CAREER_DATA.empty:
        return "Career data not available. Please check if the CSV file is loaded correctly."
    
    # Filter data by degree program (case-insensitive)
    filtered_data = CAREER_DATA[
        CAREER_DATA['degree_program'].str.contains(degree_program, case=False, na=False)
    ]
    
    if filtered_data.empty:
        return f"No specific career data found for {degree_program}. Consider exploring related fields or general career advice."
    
    result = f"Career Opportunities for {degree_program}:\n\n"
    
    for _, row in filtered_data.iterrows():
        result += f"📋 **Job Role**: {row['job_role']}\n"
        result += f"🏢 **Key Industries**: {row['key_industries']}\n"
        result += f"🎯 **Required Skills**: {row['top_skills_required']}\n"
        result += "-" * 50 + "\n"
    
    return result

@tool
def get_skill_analysis(job_role: str) -> str:
    """
    Analyze skills required for a specific job role
    
    Args:
        job_role: The job role to analyze
    
    Returns:
        Detailed skill analysis
    """
    if CAREER_DATA.empty:
        return "Career data not available."
    
    # Search for job role (case-insensitive)
    filtered_data = CAREER_DATA[
        CAREER_DATA['job_role'].str.contains(job_role, case=False, na=False)
    ]
    
    if filtered_data.empty:
        return f"No data found for job role: {job_role}"
    
    result = f"Skill Analysis for {job_role}:\n\n"
    
    for _, row in filtered_data.iterrows():
        skills = row['top_skills_required'].split(', ')
        
        result += f"🎓 **Degree Program**: {row['degree_program']}\n"
        result += f"🏭 **Industries**: {row['key_industries']}\n\n"
        result += "📚 **Required Skills Breakdown**:\n"
        
        # Categorize skills
        technical_skills = []
        soft_skills = []
        tools_software = []
        
        for skill in skills:
            skill = skill.strip()
            if any(tool in skill.lower() for tool in ['software', 'sql', 'python', 'java', 'excel', 'autocad', 'matlab', 'sap']):
                tools_software.append(skill)
            elif any(soft in skill.lower() for soft in ['communication', 'leadership', 'teamwork', 'problem-solving', 'creativity']):
                soft_skills.append(skill)
            else:
                technical_skills.append(skill)
        
        if technical_skills:
            result += "\n🔧 **Technical Skills**:\n"
            for skill in technical_skills[:5]:  # Limit to top 5
                result += f"  • {skill}\n"
        
        if tools_software:
            result += "\n💻 **Tools & Software**:\n"
            for tool in tools_software[:5]:
                result += f"  • {tool}\n"
        
        if soft_skills:
            result += "\n🤝 **Soft Skills**:\n"
            for skill in soft_skills[:3]:
                result += f"  • {skill}\n"
    
    return result

@tool
def web_search_resources(query: str, resource_type: str = "general") -> str:
    """
    Search for career resources on the web using Tavily search
    
    Args:
        query: Search query for resources
        resource_type: Type of resource (courses, books, videos, certifications)
    
    Returns:
        Formatted search results with resource recommendations
    """
    # This will be handled by the Tavily search tool from AIQ
    # But we can enhance the query based on resource type
    
    search_queries = {
        "courses": f"{query} online courses Coursera Udemy edX certification training",
        "books": f"{query} best books textbooks recommendations guide manual",
        "videos": f"{query} tutorial videos YouTube learning lecture",
        "certifications": f"{query} professional certifications career advancement credential",
        "jobs": f"{query} jobs Nigeria career opportunities salary hiring",
        "general": f"{query} career resources learning materials Nigeria"
    }
    
    enhanced_query = search_queries.get(resource_type, search_queries["general"])
    
    result = f"🔍 **Enhanced Search Query for {resource_type.title()} Resources**: {enhanced_query}\n\n"
    result += f"💡 **Search Tips**:\n"
    result += f"• Original query: {query}\n"
    result += f"• Resource type: {resource_type}\n"
    result += f"• The actual web search will be performed by the Tavily search tool\n"
    result += f"• Results will include relevant {resource_type} from across the web\n\n"
    
    # Add resource-specific guidance
    if resource_type == "courses":
        result += "📚 **What to look for in courses**:\n"
        result += "• Check course ratings and reviews\n"
        result += "• Look for certificates of completion\n"
        result += "• Verify instructor credentials\n"
        result += "• Consider course duration and time commitment\n"
        
    elif resource_type == "books":
        result += "📖 **Book selection tips**:\n"
        result += "• Check publication date for relevance\n"
        result += "• Read reviews from other learners\n"
        result += "• Look for books by industry experts\n"
        result += "• Consider both theoretical and practical books\n"
        
    elif resource_type == "videos":
        result += "🎥 **Video learning best practices**:\n"
        result += "• Start with beginner-friendly content\n"
        result += "• Look for structured playlists\n"
        result += "• Check channel credibility and subscriber count\n"
        result += "• Practice along with tutorials\n"
        
    elif resource_type == "certifications":
        result += "🏆 **Certification considerations**:\n"
        result += "• Industry recognition and value\n"
        result += "• Cost vs. career benefit\n"
        result += "• Prerequisites and exam difficulty\n"
        result += "• Renewal requirements\n"
    
    result += f"\n⚠️ **Note**: Use the Tavily search tool with this enhanced query: '{enhanced_query}'"
    
    return result

@tool
def create_learning_path(career_goal: str, current_level: str = "beginner") -> str:
    """
    Create a structured learning path for a career goal
    
    Args:
        career_goal: The target career or job role
        current_level: Current skill level (beginner, intermediate, advanced)
    
    Returns:
        Structured learning path with timeline
    """
    # Find relevant career data
    if not CAREER_DATA.empty:
        relevant_careers = CAREER_DATA[
            CAREER_DATA['job_role'].str.contains(career_goal, case=False, na=False)
        ]
    else:
        relevant_careers = pd.DataFrame()
    
    result = f"📚 **Learning Path for**: {career_goal}\n"
    result += f"👤 **Current Level**: {current_level.title()}\n\n"
    
    # Timeline based on current level
    timeline_map = {
        "beginner": "6-12 months",
        "intermediate": "3-6 months", 
        "advanced": "1-3 months"
    }
    
    result += f"⏱️ **Estimated Timeline**: {timeline_map.get(current_level, '6-12 months')}\n\n"
    
    # Phase-based learning structure
    phases = [
        {
            "phase": "Foundation Phase (Weeks 1-4)",
            "focus": "Basic concepts and fundamentals",
            "activities": [
                "📖 Read introductory materials",
                "🎥 Watch foundational video tutorials", 
                "💻 Set up development environment",
                "🔍 Explore industry overview"
            ]
        },
        {
            "phase": "Skill Building Phase (Weeks 5-12)",
            "focus": "Core technical and professional skills",
            "activities": [
                "🎓 Take structured online courses",
                "🛠️ Work on practical projects",
                "📝 Practice with hands-on exercises",
                "🤝 Join professional communities"
            ]
        },
        {
            "phase": "Specialization Phase (Weeks 13-20)",
            "focus": "Advanced topics and specialization",
            "activities": [
                "🏆 Pursue relevant certifications",
                "📊 Build portfolio projects",
                "🔬 Explore cutting-edge technologies",
                "👥 Network with industry professionals"
            ]
        },
        {
            "phase": "Career Preparation (Weeks 21-24)",
            "focus": "Job readiness and career transition",
            "activities": [
                "📝 Update resume and LinkedIn profile",
                "🎯 Apply for relevant positions",
                "🗣️ Practice interview skills",
                "📈 Showcase completed projects"
            ]
        }
    ]
    
    for phase in phases:
        result += f"## {phase['phase']}\n"
        result += f"**Focus**: {phase['focus']}\n\n"
        result += "**Key Activities**:\n"
        for activity in phase['activities']:
            result += f"  {activity}\n"
        result += "\n"
    
    # Add specific skills from career data if available
    if not relevant_careers.empty:
        result += "## 🎯 **Key Skills to Focus On**:\n\n"
        for _, row in relevant_careers.head(1).iterrows():
            skills = row['top_skills_required'].split(', ')
            for i, skill in enumerate(skills[:8], 1):
                result += f"{i}. {skill.strip()}\n"
    
    result += "\n💡 **Pro Tips**:\n"
    result += "• Set weekly learning goals and track progress\n"
    result += "• Join relevant online communities and forums\n" 
    result += "• Build projects that demonstrate your skills\n"
    result += "• Seek mentorship from industry professionals\n"
    result += "• Stay updated with industry trends and news\n"
    
    return result

@tool
def get_industry_insights(industry: str) -> str:
    """
    Get insights about a specific industry in Nigeria
    
    Args:
        industry: The industry to analyze
    
    Returns:
        Industry insights and trends
    """
    if CAREER_DATA.empty:
        return "Career data not available."
    
    # Find jobs in the specified industry
    industry_jobs = CAREER_DATA[
        CAREER_DATA['key_industries'].str.contains(industry, case=False, na=False)
    ]
    
    if industry_jobs.empty:
        return f"No data found for industry: {industry}"
    
    result = f"🏭 **Industry Insights**: {industry.title()}\n\n"
    
    # Available job roles
    job_roles = industry_jobs['job_role'].tolist()
    result += f"📋 **Available Job Roles** ({len(job_roles)}):\n"
    for i, role in enumerate(job_roles[:10], 1):  # Limit to top 10
        result += f"{i}. {role}\n"
    
    # Required degree programs
    degrees = industry_jobs['degree_program'].value_counts()
    result += f"\n🎓 **Relevant Degree Programs**:\n"
    for degree, count in degrees.head(5).items():
        result += f"• {degree} ({count} roles)\n"
    
    # Most common skills across the industry
    all_skills = []
    for skills_str in industry_jobs['top_skills_required']:
        skills = [skill.strip() for skill in skills_str.split(',')]
        all_skills.extend(skills)
    
    # Count skill frequency
    skill_freq = defaultdict(int)
    for skill in all_skills:
        skill_freq[skill] += 1
    
    result += f"\n🎯 **Most In-Demand Skills**:\n"
    sorted_skills = sorted(skill_freq.items(), key=lambda x: x[1], reverse=True)
    for skill, freq in sorted_skills[:10]:
        result += f"• {skill} (mentioned {freq} times)\n"
    
    # Industry growth indicators (mock data - replace with real market data)
    result += f"\n📈 **Market Outlook**:\n"
    result += "• Growing demand for digital skills\n"
    result += "• Increasing focus on automation and AI\n" 
    result += "• Strong emphasis on data-driven decision making\n"
    result += "• Rising importance of cybersecurity\n"
    result += "• Expansion of remote work opportunities\n"
    
    return result

# Enhanced system message for career guidance
system_message = """
You are an expert AI Career Guidance Assistant specializing in the Nigerian job market. Your mission is to provide comprehensive, personalized career guidance to help individuals navigate their professional journey successfully.

## Your Core Capabilities:

1. **Career Path Analysis**: Use the career database to identify opportunities based on degree programs and interests
2. **Skill Gap Assessment**: Analyze required skills for target roles and identify areas for development  
3. **Resource Curation**: Use Tavily search to find relevant learning materials, courses, books, and videos
4. **Learning Path Creation**: Design structured, timeline-based learning plans
5. **Industry Insights**: Provide market intelligence and trend analysis
6. **Conversation Memory**: Maintain context and build on previous discussions

## Search Strategy:

When users ask for resources, you should:
1. First use the web_search_resources tool to get enhanced search queries
2. Then use the tavily_search tool with the enhanced query to get real web results
3. Analyze and present the results in a helpful format

## Your Personality and Approach:

- **Mentoring Style**: Supportive, encouraging, and practical
- **Cultural Awareness**: Understand Nigerian education system and job market dynamics
- **Evidence-Based**: Use data from the career database and real-world insights
- **Action-Oriented**: Provide concrete next steps and actionable advice
- **Growth Mindset**: Encourage continuous learning and skill development

## Available Tools:
- search_career_opportunities: Find career options by degree program
- get_skill_analysis: Analyze skills needed for specific job roles
- web_search_resources: Enhance search queries for different resource types
- create_learning_path: Design structured learning journeys
- get_industry_insights: Provide industry analysis and trends
- tavily_search: Perform actual web searches for resources (use enhanced queries)
- current_datetime: Get current date and time

## Guidelines:
1. Always start by understanding the user's current situation, interests, and goals
2. Use the career database to provide specific, relevant information
3. For resource searches, first enhance the query then use Tavily search
4. Recommend multiple resource types (courses, books, videos, certifications)
5. Create realistic timelines and milestones
6. Address both technical and soft skills development
7. Consider the Nigerian job market context
8. Encourage networking and professional development
9. Track user progress across conversations

## Response Structure:
- Lead with empathy and understanding
- Provide specific, actionable advice
- Include resource recommendations with web search results
- Suggest next steps
- Maintain encouraging and professional tone

Remember: Your goal is to empower users to make informed career decisions and achieve their professional aspirations through structured guidance and continuous support.
"""

# ...existing code...
@register_function(config_type=NigeriaPathwiseFunctionConfig)
async def nigeria_pathwise_function(
    config: NigeriaPathwiseFunctionConfig, builder: Builder
):
    """
    Enhanced Career Guide Function with conversation history and web search
    """
    
    # Initialize components
    llm_ref = LLMRef(config.llm_name)
    llm = await builder.get_llm(llm_ref, LLMFrameworkEnum.LANGCHAIN)
    
    embedder_ref = EmbedderRef(config.embedder_name)
    embedder = await builder.get_embedder(embedder_ref, LLMFrameworkEnum.LANGCHAIN)
    
    # Document processing and retrieval setup
    vector_store = None
    retriever_tool = None
    
    try:
        # Load documents from the specified glob pattern
        if os.path.exists("data/career_resources"):
            loader = DirectoryLoader(
                "data/career_resources",
                glob="*.{pdf,txt,docx,csv,xlsx}",
                loader_cls=TextLoader,
                show_progress=True
            )
            documents = loader.load()
            
            if documents:
                # Split documents
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=config.chunk_size,
                    chunk_overlap=200
                )
                splits = text_splitter.split_documents(documents)
                
                # Create vector store
                vector_store = FAISS.from_documents(splits, embedder)
                
                # Create retriever tool
                retriever = vector_store.as_retriever(search_kwargs={"k": 5})
                retriever_tool = create_retriever_tool(
                    retriever,
                    name="career_resource_search",
                    description="Search through uploaded career resources and documents for specific information"
                )
    except Exception as e:
        logger.warning(f"Document processing failed: {e}")
    
    # Get additional tools (including Tavily search)
    additional_tools = []
    for tool_name in config.tool_names:
        try:
            tool_ref = FunctionRef(tool_name)
            tool = await builder.get_function_as_tool(tool_ref)
            additional_tools.append(tool)
        except Exception as e:
            logger.warning(f"Failed to load tool {tool_name}: {e}")
    
    # Combine all tools
    career_tools = [
        search_career_opportunities,
        get_skill_analysis,
        web_search_resources,  # This provides enhanced queries
        create_learning_path,
        get_industry_insights
    ]
    
    all_tools = career_tools + additional_tools
    if retriever_tool:
        all_tools.append(retriever_tool)
    
    # Enhanced React agent setup
    react_prompt = hub.pull("hwchase17/react")
    react_prompt.template = system_message + "\n\n" + react_prompt.template
    
    agent = create_react_agent(llm=llm, tools=all_tools, prompt=react_prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=all_tools,
        max_iterations=10,  # Increased to allow for search + analysis
        handle_parsing_errors=True,
        verbose=True,
        return_intermediate_steps=False,
        max_execution_time=180,  # Increased timeout for web searches
        early_stopping_method="generate"
    )
    
    # Conversation history management
    conversation_history = []
    
    async def _response_fn(input_message: str) -> str:
        nonlocal conversation_history
        
        try:
            # Add user message to history
            conversation_history.append({
                "role": "user",
                "content": input_message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Prepare context with conversation history
            if len(conversation_history) > 1:
                context = "\n\nConversation History:\n"
                recent_history = conversation_history[-(config.max_history * 2):]
                
                for msg in recent_history[-6:]:  # Last 3 exchanges
                    role = msg["role"].title()
                    content = msg["content"][:200] + "..." if len(msg["content"]) > 200 else msg["content"]
                    context += f"{role}: {content}\n"
                
                enhanced_input = f"{input_message}\n{context}"
            else:
                enhanced_input = input_message
            
            # Generate response using the agent
            response = await agent_executor.ainvoke({
                "input": enhanced_input
            })
            
            output_message = response.get("output", "I apologize, but I encountered an issue processing your request. Please try again.")
            
            # Add assistant response to history
            conversation_history.append({
                "role": "assistant", 
                "content": output_message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Trim history if it gets too long
            if len(conversation_history) > config.max_history * 2:
                conversation_history = conversation_history[-(config.max_history * 2):]
            
            # Add conversation summary for long conversations
            if len(conversation_history) > 10:
                output_message += f"\n\n---\n💬 **Session Info**: We've covered {len(conversation_history)//2} topics. I remember our conversation to provide better guidance."
            
            return output_message
            
        except Exception as e:
            logger.error(f"Error in career guide function: {e}")
            return f"I encountered an error while processing your request: {str(e)}. Please try rephrasing your question or let me know if you need help with something specific."

    try:
        yield FunctionInfo.create(single_fn=_response_fn)
    except GeneratorExit:
        logger.info("Career guide function exited early!")
    finally:
        logger.info("Cleaning up career guide workflow.")
        if vector_store:
            # Cleanup vector store resources if needed
            pass