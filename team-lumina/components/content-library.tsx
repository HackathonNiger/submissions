"use client";

import { useData } from "@/context/DataContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function ContentLibrary() {
  const { studentData } = useData();

  if (!studentData) {
    return <p>Loading data...</p>;
  }

  const { contentLibrary, quizHistory } = studentData;

  const organizedContent = contentLibrary.reduce((acc, content) => {
    (acc[content.subject] = acc[content.subject] || []).push(content);
    return acc;
  }, {} as Record<string, typeof contentLibrary>);

  const organizedQuizzes = quizHistory.reduce((acc, quiz) => {
    (acc[quiz.subject] = acc[quiz.subject] || []).push(quiz);
    return acc;
  }, {} as Record<string, typeof quizHistory>);

  const allSubjects = Array.from(
    new Set([
      ...Object.keys(organizedContent),
      ...Object.keys(organizedQuizzes),
    ])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Digital Notebook</CardTitle>
        <CardDescription>
          Review all your generated lessons and completed quizzes here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allSubjects.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Your notebook is empty. Generate some content or take a quiz to get
            started!
          </p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {allSubjects.map((subject) => (
              <AccordionItem value={subject} key={subject}>
                <AccordionTrigger className="text-xl font-bold">
                  {subject}
                </AccordionTrigger>
                <AccordionContent className="pl-4 space-y-4">
                  {organizedContent[subject] && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Lessons & Notes
                      </h3>
                      <Accordion type="multiple" className="w-full">
                        {organizedContent[subject].map((content) => (
                          <AccordionItem value={content.id} key={content.id}>
                            <AccordionTrigger>{content.topic}</AccordionTrigger>
                            <AccordionContent className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-md space-y-3">
                              <p className="font-semibold">Explanation:</p>
                              <p className="text-sm whitespace-pre-wrap">
                                {content.body.explanation}
                              </p>
                              <p className="font-semibold mt-2">Examples:</p>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {content.body.examples.map((ex, i) => (
                                  <li key={i}>{ex}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}

                  {organizedQuizzes[subject] && (
                    <div>
                      <h3 className="text-lg font-semibold mt-4 mb-2">
                        Quiz History
                      </h3>
                      <Accordion type="multiple" className="w-full">
                        {organizedQuizzes[subject].map((quiz) => (
                          <AccordionItem value={quiz.id} key={quiz.id}>
                            <AccordionTrigger>
                              {quiz.topic} -{" "}
                              <span className="ml-2 font-normal">
                                {format(new Date(quiz.completedAt), "PPp")}
                              </span>
                              <Badge className="ml-auto">
                                Score: {quiz.score}%
                              </Badge>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-md space-y-3">
                              {quiz.questions.map((q, i) => (
                                <div key={i} className="pb-2 border-b">
                                  <p className="font-medium">{q.question}</p>
                                  <p className="text-sm text-green-600">
                                    Correct Answer: {q.correctAnswer}
                                  </p>
                                  <p className="text-sm text-blue-600">
                                    Your Answer: {quiz.userAnswers[q.id]}
                                  </p>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
