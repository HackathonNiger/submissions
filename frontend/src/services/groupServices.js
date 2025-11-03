// frontend/src/services/groupServices.js

import { api } from './api';

/**
 * Get all groups where user is a member
 */
const getUserGroups = async () => {
  try {
    console.log('📊 Fetching user groups...');
    const response = await api.get('/groups');
    console.log('✅ Groups fetched:', response.data.groups.length);
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch groups:', error);
    throw error;
  }
};

/**
 * Get specific group by ID
 */
const getGroupById = async (groupId) => {
  try {
    console.log('🔍 Fetching group:', groupId);
    const response = await api.get(`/groups/${groupId}`);
    console.log('✅ Group fetched:', response.data.group.name);
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch group:', error);
    throw error;
  }
};

/**
 * Find group by invitation code
 */
const findGroupByCode = async (code) => {
  try {
    console.log('🔍 Finding group with code:', code);
    const response = await api.get(`/groups/find/${code}`);
    console.log('✅ Group found:', response.data.group.name);
    return response;
  } catch (error) {
    console.error('❌ Failed to find group:', error);
    throw error;
  }
};

/**
 * Join a group
 */
const joinGroup = async (groupId) => {
  try {
    console.log('👥 Joining group:', groupId);
    const response = await api.post(`/groups/${groupId}/join`);
    console.log('✅ Successfully joined group');
    return response;
  } catch (error) {
    console.error('❌ Failed to join group:', error);
    throw error;
  }
};

/**
 * Get group statistics
 */
const getGroupStats = async (groupId) => {
  try {
    console.log('📊 Fetching group stats:', groupId);
    const response = await api.get(`/groups/${groupId}/stats`);
    console.log('✅ Stats fetched');
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch stats:', error);
    throw error;
  }
};

const groupService = {
  getUserGroups,
  getGroupById,
  findGroupByCode,
  joinGroup,
  getGroupStats
};

export default groupService;