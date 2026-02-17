const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testCourses() {
    try {
        // 1. Register a temporary user
        const username = `testuser_${Date.now()}`;
        const email = `${username}@example.com`;
        const password = 'password123';

        console.log(`\n1. Registering user: ${username}...`);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username,
                email,
                password,
                nativeLanguage: 'English'
            });
            console.log('   User registered.');
        } catch (err) {
            // If user exists or other error, try login
            console.log('   Registration skipped/failed (might exist), trying login...');
        }

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        const token = loginRes.data.token;
        console.log('   Login successful. Token received.');

        const config = {
            headers: { 'x-auth-token': token }
        };

        // 3. Fetch Courses (Before Enrollment)
        console.log('\n3. Fetching courses (Expect isEnrolled: false)...');
        const coursesRes1 = await axios.get(`${API_URL}/learning/courses`, config);
        const courses1 = coursesRes1.data;

        if (courses1.length === 0) {
            console.error('   No courses found. Ensure server has data or mock data.');
            return;
        }

        const targetCourse = courses1[0];
        console.log(`   Found ${courses1.length} courses.`);
        console.log(`   Target Course: ${targetCourse.title} (ID: ${targetCourse._id})`);
        console.log(`   Current Enrollment Status: ${targetCourse.isEnrolled}`);

        if (targetCourse.isEnrolled) {
            console.log('   (User already enrolled, skipping enroll step validation)');
        } else {
            // 4. Enroll
            console.log(`\n4. Enrolling in course ${targetCourse._id}...`);
            await axios.post(`${API_URL}/learning/enroll/${targetCourse._id}`, {}, config);
            console.log('   Enrollment request sent.');

            // 5. Fetch Courses (After Enrollment)
            console.log('\n5. Fetching courses again (Expect isEnrolled: true)...');
            const coursesRes2 = await axios.get(`${API_URL}/learning/courses`, config);
            const targetCourseUpdated = coursesRes2.data.find(c => c._id === targetCourse._id);

            console.log(`   Updated Enrollment Status: ${targetCourseUpdated.isEnrolled}`);

            if (targetCourseUpdated.isEnrolled) {
                console.log('   SUCCESS: Enrollment persisted!');
            } else {
                console.error('   FAILURE: Course still shows not enrolled.');
            }
        }

        // 6. Check for content structure (Subtitles/Transliteration)
        if (targetCourse.lessonsList && targetCourse.lessonsList.length > 0) {
            const lesson = targetCourse.lessonsList[0];
            console.log('\n6. Verifying Lesson Content Structure...');
            console.log(`   Lesson: ${lesson.title}`);
            console.log(`   Subtitles: ${lesson.subtitles ? 'Present' : 'Missing'}`);
            console.log(`   Transliteration: ${lesson.transliteration ? 'Present' : 'Missing'}`);
        }

    } catch (err) {
        console.error('TEST FAILED:', err.response ? err.response.data : err.message);
    }
}

testCourses();
