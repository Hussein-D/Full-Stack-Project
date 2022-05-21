const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

const db = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "",
    database : "myData"
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get("/getItems",(req ,res)=>{
    const sqlGet = "SELECT * FROM items WHERE status = 1";
    db.query(sqlGet , (err , result)=>{
        res.send(result);
    })
});

app.get("/getRecieptItems",(req ,res)=>{
    const sqlGet = "SELECT * FROM items";
    db.query(sqlGet , (err , result)=>{
        res.send(result);
    })
});

app.get("/getItem/:id",(req,res)=>{
    let id = req.params['id'];
    const sqlGet = "SELECT inputsDate FROM items WHERE id = ?";
    db.query(sqlGet ,[id], (err , result)=>{
        res.send(result);
    })
});

app.post('/addItem',(req,res)=>{
    const {name , quantity , sold} = req.body;
    const sqlInsert = "INSERT INTO items (name , quantity , sold , status) VALUES ( ? , ? , ? , 1)";
    db.query(sqlInsert , [name , quantity , sold] , (err, result)=>{
        if (err) {
            console.log(err);
            return res.status(401).json({ message : "Failed to update" , error : err });
        }
        else{
            return res.status(200).json({ message : "success" });
        }
    });
});
app.patch('/editItem',(req,res)=>{
    // let myInputsDate ;
    const {id , quantity , sold , input , output , inputRecieptNb , outputRecieptNb , date , inputsDate} = req.body;
    if(inputsDate == date){
        const sqlUpdate = "UPDATE items SET quantity = ? , sold = ? , input = input + ? , output = output + ? , inputRecieptNb = ? , outputRecieptNb = ? WHERE id = ?";
        db.query(sqlUpdate , [quantity , sold , input , output , inputRecieptNb , outputRecieptNb , id] , (err, result)=>{
            if (err) {
                console.log(err);
                return res.status(401).json({ message : "Failed to update" , error : err });
            }
            else{
                // console.log(result);
                return res.status(200).json({ message : "success" });
            }
        });
    }
    if(inputsDate != date){
        const sqlUpdate = "UPDATE items SET quantity = ? , sold = ? , input = ? , output = ? , inputRecieptNb = ? , outputRecieptNb = ? , inputsDate = ? WHERE id = ?";
        db.query(sqlUpdate , [quantity , sold , input , output , inputRecieptNb , outputRecieptNb , date , id] , (err , result)=>{
            if (err) { 
                console.log(err);
                return res.status(401).json({ message : "Failed to update" , error : err });
            }
            else{
                // console.log(result);
                return res.status(200).json({ message : "success" });
            }
        });
    }
});
app.patch('/deleteItem/:id',(req,res)=>{
    let id = req.params['id'];
    const sqlDelete = "UPDATE items SET status = 0 WHERE id = ?";
    db.query(sqlDelete , [id] , (err , result)=>{
        if(err){
            console.log(err);
            return res.status(401).json({ message : "Failed to delete." });
        }
        else{
            return res.status(200).json({ message : "success" });
        }
    })
});

app.post("/addReciept",(req,res)=>{
    let { itemId , input , output , recieptDate , recieptNb } = req.body;
    const sqlInsert = "INSERT INTO recieptitem (itemId , input , output , recieptDate , recieptNb) VALUES ( ? , ? , ? , ? , ?)";
    db.query(sqlInsert , [itemId , input , output , recieptDate , recieptNb] , (err, result)=>{
        if(err){
            console.log(err);
            return res.status(406).json({ message : "Failed to add" , err : err });
        }
        else{
            return res.status(200).json({ message : "success" });
            console.log("Reciept added successfully");
        }
    })
});

app.get("/getReciepts",(req,res)=>{
    const sqlGet = "SELECT * FROM recieptitem";
    db.query(sqlGet , (err,result)=>{
        if(err){
            console.log(err);
            return res.status(404).json({ message : "No Reciepts Found" });
        }
        else{
            res.send(result);
            // return res.status(200).json({ message : "success" });
        }
    })
})
app.get("/getReciepts/:recieptNb",(req,res)=>{
    let recieptNb = parseInt(req.params['recieptNb']);
    const sqlGet = "SELECT * FROM recieptitem WHERE recieptNb = ?";
    db.query(sqlGet , [recieptNb] , (err,result)=>{
        if(err){
            console.log(err);
            return res.status(404).json({ message : "No Reciepts Found" });
        }
        else{
            // console.log(result);
            res.send(result);
            // return res.status(200).json({ message : "success" });
        }
    })
})

app.delete("/delete/reciept/:recieptNb",(req,res)=>{
    let recieptNb = parseInt(req.params['recieptNb']);
    const sqlDelete = "DELETE FROM recieptitem WHERE recieptNb = ?";
    db.query(sqlDelete , [recieptNb] , (err , result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({ message : "Failed to delete reciept" });
        }
        else{
            res.send(result);
        }
    })
})

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})  
