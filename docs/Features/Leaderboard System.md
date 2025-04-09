# Leaderboard System

## Overview

This feature allows students to form study groups, track their collective progress on a syllabus, and compete via a points-based leaderboard. It aims to enhance motivation and provide insights into group and individual study habits.

## Core Functionality

1.  **Study Group Creation:** Students can create or join study groups within the platform.
2.  **Input Processing:** The group leader uploads the exam timetable (PDF, image, etc.) and the syllabus (PDF). An AI service processes these documents to:
    *   Format the syllabus clearly.
    *   Divide the syllabus into distinct topics or units.
    *   Create a shared group dashboard based on the processed syllabus.
3.  **Shared Dashboard:** A central hub for the study group, featuring:
    *   **Progress Tracking:** Members update their status for each syllabus topic (e.g., "Not Started", "Studying", "Completed", "Revised", "Mastered").
    *   **Points System:** Updating a status automatically assigns points to the member for that topic, reflecting their progress.
    *   **Live Leaderboard:** Displays real-time scores of all group members based on their accumulated progress points.
    *   **Analysis:** Provides visualizations and summaries of:
        *   Individual and group confidence levels per subject/unit.
        *   Remaining study tasks.
        *   Overall study status distribution within the group.

## AI Integration

The AI service plays a crucial role in parsing unstructured timetable and syllabus documents, structuring the information, and enabling the automated setup of the group's study dashboard and tracking system.