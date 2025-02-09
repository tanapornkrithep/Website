const express = require("express");
const { MongoClient, ObjectId } = require("mongodb")
const app = express();
const cors = require('cors');
app.use(cors());  // จะอนุญาตให้ทุกต้นทางเข้าถึง API ของคุณ

app.use(express.json())
let db;
const client = new MongoClient("mongodb://localhost:27017");
client.connect().then(() => {
    db = client.db("ecommerce");
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB unconnect");
});


// ดึงข้อมูลทั้งหมด
app.get('/student', async (req, res) => {
    try {
        const product = await db.collection("student").find().toArray();
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});

app.get('/student/id/:studentid', async (req, res) => {
    try {
        const studentid = req.params.studentid;  // รับค่าจาก URL parameter :studentid
        const student = await db.collection("student").findOne({ studentid: studentid });  // ค้นหาด้วย studentid

        if (student) {
            res.json(student);  // ส่งข้อมูลของนักศึกษากลับ
        } else {
            res.json([]);  // ส่งข้อมูลของนักศึกษากลับ
        }
    } catch (err) {
        console.error(err);  // แสดงข้อผิดพลาดใน console
        res.status(500).json({ message: 'Error occurred' });  // ส่งข้อความแสดงข้อผิดพลาด
    }
});

 

app.post('/student', async (req, res) => {
    try {
        const data = req.body;
        const student = await db.collection("student").insertOne(data);
        res.json(student);
    } catch (err) {
        console.error(err);  // แสดงข้อผิดพลาดใน console
        res.status(500).json({ message: 'Error occurred' });  // ส่งข้อความแสดงข้อผิดพลาด
    }
});

// แก้ไขข้อมูลนักศึกษา
app.put('/student/:studentid', async (req, res) => {
    try {
        const studentid = req.params.studentid;
        const data = req.body;
        const student = await db.collection("student").updateOne(
            { studentid: studentid },
            { $set: data }
        );
        if (student.matchedCount > 0) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        console.error(err);  // แสดงข้อผิดพลาดใน console
        res.status(500).json({ message: 'Error occurred' });  // ส่งข้อความแสดงข้อผิดพลาด
    }
});

// ลบข้อมูลนักศึกษา
app.delete('/student/:studentid', async (req, res) => {
    try {
        const studentid = req.params.studentid;
        const result = await db.collection("student").deleteOne({ studentid: studentid });
        res.json(result.deletedCount > 0 ? "Student deleted successfully" : "Student not found");
    } catch (err) {
        console.error(err);  // แสดงข้อผิดพลาดใน console
        res.status(500).json({ message: 'Error occurred' });  // ส่งข้อความแสดงข้อผิดพลาด
    }
});




app.listen(3000, () => {
    console.log('Server started: success');
});