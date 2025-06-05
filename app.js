const express = require('express');

const connectToDB = require("./config/dbConnect.js")

const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

const cors = require("cors")

require('dotenv').config();


connectToDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
    origin : "*"
}));

//routes

app.use("/api/auth/",require("./routes/authRoutes.js"))

app.use("/api/users/",require("./routes/userRoutes.js"))

app.use("/api/courses/",require("./routes/courseRoutes.js"))

app.use("/api/lessons/",require("./routes/lessonRoutes.js"))

app.use("/api/chats/",require("./routes/chatRoutes.js"))

app.use("/api/quizzes/",require("./routes/quizRoutes.js"))

app.use("/api/questions/",require("./routes/questionRoutes.js"))

//app.use("/api/enrollments/",require("./routes/enrollmentRoutes.js"))

app.use('/api/payments', require("./routes/paymentRoutes.js"));


// Error handler middleware

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

