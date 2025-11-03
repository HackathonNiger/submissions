import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

class ConversationHistoryCardOne extends StatelessWidget {
  const ConversationHistoryCardOne({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Container(
        width: MediaQuery.of(context).size.height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(width: 1, color: Colors.grey.withOpacity(0.3)),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.05),
              offset: Offset(2, 2),
              spreadRadius: 2,
              blurRadius: 15
            )
          ]
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 11.0, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Design Agency",
                        style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey
                        ),
                      ),
                      Text(
                        "Create Detailed Landing Page",
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w400
                        ),
                      ),
                    ],
                  ),
                  IconButton(onPressed: (){}, icon: Icon(IconlyLight.delete, color: Colors.grey, size: 19,))
                ],
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8),
                child: Container(
                  height: 1,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.2)
                  ),
                ),
              ),
              Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.grey.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10)
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 5),
                      child: Row(
                        children: [
                          Icon(IconlyLight.calendar, color: Colors.grey, size: 15,),
                          const SizedBox(width: 2,),
                          Text(
                            "20 November 2025",
                            style: TextStyle(
                                fontSize: 11,
                                color: Colors.grey,
                                fontWeight: FontWeight.w400
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 5,),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.grey.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10)
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 5),
                      child: Row(
                        children: [
                          Icon(IconlyLight.time_circle, color: Colors.grey, size: 15,),
                          const SizedBox(width: 2,),
                          Text(
                            "11:30AM",
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey,
                              fontWeight: FontWeight.w500
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
