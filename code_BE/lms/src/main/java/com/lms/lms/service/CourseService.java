package com.lms.lms.service;

import com.lms.lms.dto.request.CreateCourseRequest;
import com.lms.lms.dto.request.UpdateCourseRequest;
import com.lms.lms.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {
    CourseResponse createCourse(CreateCourseRequest request, String instructorId);
    List<CourseResponse> getPublishedCourses();
    List<CourseResponse> getCoursesByInstructor(String instructorId);
    CourseResponse getCourseById(String courseId, String requesterId, String role);
    CourseResponse updateCourse(String courseId, UpdateCourseRequest request, String requesterId, String role);
    void deleteCourse(String courseId, String requesterId, String role);
    CourseResponse publishCourse(String courseId, String requesterId, String role);
}
