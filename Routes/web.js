var express=require('express');

var router=express.Router();
var query1=require('../db.js');

router.get('/',async(req,res)=>{
    // res.send("Welcome Website Panel");
    var sql='select * from blog';
    var blog=await query1(sql);
    var ser_sql='select * from service';
    var service_data=await query1(ser_sql);
    res.render('web/index.ejs',{blog:blog,service:service_data});
})
router.post('/book_appoinnment',async(req,res)=>{
    var{name,email,service_id,appoinment_date}=req.body;
    var sql='insert into appoinment_enquiery(name,email,service_id,appoinment_date,status) values(?,?,?,?,?)';
    var data=await query1(sql,[name,email,service_id,appoinment_date,'pending']);
    res.redirect('/');
})
router.get('/Whyus',(req,res)=>{
    // res.send("why");
    res.render('web/whyus.ejs');
})
router.get('/service',(req,res)=>{
    res.render('web/service.ejs');
})
router.get('/team',(req,res)=>{
    res.render('web/team.ejs');
})
router.get('/pricing',(req,res)=>{
    res.render('web/pricing.ejs');
})
router.get('/DentalSolutions',async(req,res)=>{
    var sql='select * from dentalsolutions';
    var data=await query1(sql);
    res.render('web/dentalsolutions.ejs',{data:data});
})

module.exports=router;