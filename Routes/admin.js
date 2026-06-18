var express=require('express');
var router=express.Router();
var query1=require('../db.js');
var path=require('path');
var fs=require('fs');

router.get('/',async(req,res)=>{
    // res.send("Welcome Admin Panel");
    var sql=`select * from login`;
    var data=await query1(sql);
    // res.send(data);
    res.render('admin/login.ejs');
})
router.post('/login_check',async(req,res)=>{
    // res.send(req.body); 
    var{username,password}=req.body;
    var sql=`select * from login where username=? and password=?`;
    var data=await query1(sql,[username,password]);
    if(data){
    // res.send(data);
    // session
    req.session.lid=data[0].lid;
    req.session.admin_name=data[0].admin_name;
    // res.send(req.session);
    res.redirect('/admin/index');
    }else{
        // res.send('not found');
        res.redirect('/admin/');
    }
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin/');
})
router.get('/forgot',(req,res)=>{
    res.render('admin/forgot.ejs');
})
router.get('/index',(req,res)=>{
    var name=req.session.admin_name;
    // res.send(name);
    res.render('admin/index.ejs',{aname:name});
})
router.get('/dentalsolutions', async(req,res)=>{
    var sql='select * from dentalsolutions';
    var data=await query1(sql);
    res.render('admin/dentalsolutions.ejs',{data:data});
})
router.post('/dentalsolutions_save',async(req,res)=>{
    // res.send(req.body);
    var{title,description}=req.body;
    var sql=`insert into dentalsolutions(title,description)
    values(?,?)`;
    var data=await query1(sql,[title,description]);
    // res.send(data);
    res.redirect('/admin/dentalsolutions');
})
router.get('/dentalsolutions_delete/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='delete from dentalsolutions where did=?';
    var data=await query1(sql,[id]);
    // res.send(sql);
    res.redirect('/admin/dentalsolutions');
})
router.get('/dentalsolutions_edit/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='select * from dentalsolutions where did=?';
    var data=await query1(sql,[id]);
    // res.send(sql);
    res.render('admin/dentalsolutions_edit.ejs',{data:data[0]});
})
router.post('/dentalsolutions_edit_save/:id',async(req,res)=>{
    var id=req.params.id;
    var{title,description,did}=req.body;
    var sql='update  dentalsolutions set title=?,description=? where did=?';
    var data=await query1(sql,[title,description,id]);
    // res.send(data);
    res.redirect('/admin/dentalsolutions');
})
router.get('/blog',async(req,res)=>{
    var sql='select * from blog';
    var data=await query1(sql);
    res.render('admin/blog.ejs',{data:data});
})
router.post('/blog_save',async(req,res)=>{
    var{bdate,btitle,bdescription}=req.body;
    var fname=Date.now()+req.files.bphoto.name;
    var uploadpath=path.join(__dirname,'../','public/images/',fname);
    req.files.bphoto.mv(uploadpath);
    // res.send(uploadpath);
    var sql='insert into blog(bdate,btitle,bdescription,bphoto)values(?,?,?,?)';
    var data=await query1(sql,[bdate,btitle,bdescription,fname]);
    // res.send(data);
    res.redirect('/admin/blog');
})
router.get('/blog_delete/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;
    var imgpath=path.join(__dirname,'../','public/images/',img);
    fs.unlink(imgpath,(err)=>{});
    var sql='delete from blog where bid=?';
    var data=await query1(sql,[id]);
    res.redirect('/admin/blog');
})
router.get('/blog_edit/:id',async(req,res)=>{
    var id =req.params.id;
    var sql='select * from blog where bid=?';
    var data=await query1(sql,[id]);
    res.render('admin/blog_edit',{data:data[0]});
})
router.post('/blog_edit_save/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;
    var{bdate,btitle,bdescription}=req.body;
    if(req.files){
    var newimg=Date.now()+req.files.bphoto.name;
    var uploadpath=path.join(__dirname,'../','public/images/',newimg);
    req.files.bphoto.mv(uploadpath);
     var imgpath=path.join(__dirname,'../','public/images/',img);
    fs.unlink(imgpath,(err)=>{});
    }else{
      var  newimg=img;
    }
    var sql='update blog set bdate=?,btitle=?,bdescription=?,bphoto=? where bid=?';
    var data=await(query1(sql,[bdate,btitle,bdescription,newimg,id]));
    // res.send(data);
    res.redirect('/admin/blog');
})
router.get('/appoinment_pending',async(req,res)=>{
    var sql='select * from appoinment_enquiery where status=?';
    var data=await query1(sql,['pending']);
    res.render('admin/appoinment_pending.ejs',{data:data});
})
router.get('/app_conf/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update  appoinment_enquiery set status=? where aid=?';
    var data=await query1(sql,['Confirm',id]);
    res.redirect('/admin/appoinment_pending');
})
router.get('/app_rej/:id',async(req,res)=>{
    var id=req.params.id;
    var sql='update  appoinment_enquiery set status=? where aid=?';
    var data=await query1(sql,['Reject',id]);
    res.redirect('/admin/appoinment_pending');
})
router.get('/appoinment_confirm',async(req,res)=>{
    var sql='select * from appoinment_enquiery where status=?';
    var data=await query1(sql,['confirm']);
    res.render('admin/appoinment_confirm.ejs',{data:data});
})
router.get('/appoinment_reject',async(req,res)=>{
    var sql='select * from appoinment_enquiery where status=?';
    var data=await query1(sql,['reject']);
    res.render('admin/appoinment_reject.ejs',{data:data});
})
module.exports=router;