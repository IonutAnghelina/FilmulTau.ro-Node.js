//cu require includem pachetele folosite in proiect
const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {Client} =require('pg');
const url = require('url');
const { exec } = require("child_process");
const ejs=require('ejs');
const regex=require('regex');
var app=express();//am creat serverul

var animLimit;
//setam datele clentului PostgreSQL
//trebuie sa inlocuiti cu username-ul vostru si parola voastra pentru userul creat special pentru acest proiect
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'Iunie_2001',
    database: 'postgres',
    port:5432
})
client.connect()



app.set("view engine","ejs");//setez ca motor de template ejs
console.log("Proiectul se afla la ",__dirname);//__dirname e folderul proiectului (variabila implicit setata de node)
app.use("/resources",express.static(path.join(__dirname,"resources")));//setez folderul de resurse ca static, ca sa caute fisierele in el, in urma cererilor
/*
app.use(/\.js/ , function(req,res){
    res.setHeader('content-type', 'text/js');
});*/

function verificaImagini(){
	var textFisier=fs.readFileSync("resources/json/galerie.json") //citeste tot fisierul
	var jsi=JSON.parse(textFisier); //am transformat in obiect

	var caleGalerie=jsi.cale_galerie;
    let vectImagini=[]
	for (let im of jsi.imagini){
		var imVeche= path.join(caleGalerie, im.cale_fisier);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
		var ext = path.extname(im.cale_fisier);//obtin extensia
		var numeFisier =path.basename(im.cale_fisier,ext)//obtin numele fara extensie
		let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");//creez cale apentru imaginea noua; prin extensia wbp stabilesc si tipul ei
        let imMedie=path.join(caleGalerie+"/mediu/", numeFisier+"-mediu"+".webp");
		//console.log(imNoua);
        vectImagini.push({mare:imVeche, mediu:imMedie, mic:imNoua, descriere:im.text_descriere, anotimp:im.anotimp}); //adauga in vector un element
		if (!fs.existsSync(imNoua))
        {//daca nu exista imaginea, mai jos o voi crea
		sharp(imVeche)
		  .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imNoua, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imNoua, err);
		  });
        
        }
        

        if (!fs.existsSync(imMedie))
        {//daca nu exista imaginea, mai jos o voi crea
		sharp(imVeche)
		  .resize(250) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imMedie, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imMedie, err);
		  });
        
        }  
	}
    // [ {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}  ]
    return vectImagini;
}

app.get("/prezentare",function(req,res)
{
    animLimit=2*getRandom();
    console.log("a doua pagina");
    res.render("pagini/prezentare", {imagini: verificaImagini(),anotimpCurent: getSeason(), imageCounter: 0,animLimit:animLimit}); /* relative intotdeauna la folderul views*/
});

app.get("/filme",function(req, res){
   // console.log("Pagina de filme");

    //console.log("Url:",req.url);
    //console.log("Query:", req.query.tip);
    // conditie_booleana? val_true : val_false
    let conditie= req.query.categorie ?  " and categorie='"+req.query.categorie+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    console.log("select * from filme where 1=1"+conditie);
    client.query("select * from filme where 1=1"+conditie, function(err,rez){
        //console.log(err, rez);
        //console.log(rez.rows);
        client.query("select unnest(enum_range( null::categ_film)) as categ", function(err,rezCateg){//selectez toate valorile posibile din enum-ul categ_prajitura

           // console.log(rezCateg);
            res.render("pagini/filme", {produse:rez.rows, categorii:rezCateg.rows});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
            });
        
       
    });

    
});



app.get("/film/filme",function(req, res){
    // console.log("Pagina de filme");
 
     //console.log("Url:",req.url);
     //console.log("Query:", req.query.tip);
     // conditie_booleana? val_true : val_false
     let conditie= req.query.tip ?  " and tip_produs='"+req.query.tip+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    // console.log("select * from filme where 1=1"+conditie);
     client.query("select * from filme where 1=1"+conditie, function(err,rez){
         //console.log(err, rez);
         //console.log(rez.rows);
         client.query("select unnest(enum_range( null::categ_film)) as categ", function(err,rezCateg){//selectez toate valorile posibile din enum-ul categ_prajitura
 
            // console.log(rezCateg);
             res.render("pagini/filme", {produse:rez.rows, categorii:rezCateg.rows});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
             });
         
        
     });
 
     
 });

 

app.get("/film/:id",function(req, res){
  
  //  console.log(req.params);
    
    const rezultat= client.query("select * from filme where film_id="+req.params.id, function(err,rez){
        //console.log(err, rez);
        //console.log(rez.rows);
        res.render("pagini/film", {prod:rez.rows[0]});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
    });

    
});

app.get(["/","/index"],function(req, res){//ca sa pot accesa pagina principala si cu localhost:8080 si cu localhost:8080/index
    /*
    console.log("ceva");
    res.setHeader("Content-Type","text/html");
    res.write("<!DOCTYPE html><html><head><title>ceva</title></head><body><p>Salut, Costică!</p></body></html>");
    */
    let conditie= req.query.categorie ?  " and categorie='"+req.query.categorie+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    console.log("select * from filme where 1=1"+conditie);
    client.query("select * from filme where 1=1"+conditie, function(err,rez){
        //console.log(err, rez);
        //console.log(rez.rows);
        client.query("select unnest(enum_range( null::categ_film)) as categ", function(err,rezCateg){//selectez toate valorile posibile din enum-ul categ_prajitura

           // console.log(rezCateg);
           animLimit=2*getRandom();
            res.render("pagini/index", {produse:rez.rows, categorii:rezCateg.rows,imagini: verificaImagini(),anotimpCurent: getSeason(), imageCounter: 0,animLimit:animLimit});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
            });
        
       
    });
    
    //res.render("pagini/index", {imagini: verificaImagini(),anotimpCurent: getSeason(), imageCounter: 0,animLimit:animLimit}); /* relative intotdeauna la folderul views*/
});



app.get("*/galerie-animata.css",function(req, res){
    
    /*Atentie modul de rezolvare din acest app.get() este strict pentru a demonstra niste tehnici
    si nu pentru ca ar fi cel mai eficient mod de rezolvare*/
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss;
    console.log(animLimit);
    if(animLimit==6) sirScss=fs.readFileSync("./resources/scss/galerie_animata6.scss").toString("utf-8");//citesc scss-ul cs string
   
    if(animLimit==8) sirScss=fs.readFileSync("./resources/scss/galerie_animata8.scss").toString("utf-8");

    if(animLimit==10) sirScss=fs.readFileSync("./resources/scss/galerie_animata10.scss").toString("utf-8");
    culori=["navy","black","purple","grey"]
    let culoareAleatoare =culori[Math.floor(Math.random()*culori.length)];//iau o culoare aleatoare pentru border
    let rezScss=ejs.render(sirScss,{culoare:culoareAleatoare});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
    //console.log(rezScss);
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        console.log(`stdout: ${stdout}`);
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });

});

app.get("/ceva",function(req, res){

    res.setHeader("Content-Type","text/html");
    res.write("<!DOCTYPE html><html><head><title>ceva</title></head><body>"+ new Date() +"</body></html>");//cod html creat pe loc

});
/**app.get("/produse",function(req, res){
    //console.log("Url:",req.url);
    //console.log("Query:", req.query.tip);
    // conditie_booleana? val_true : val_false
    let conditie= req.query.tip ?  " and tip_produs='"+req.query.tip+"'" : "";//daca am parametrul tip in cale (tip=cofetarie, de exemplu) adaug conditia pentru a selecta doar produsele de acel tip
    console.log("select id, nume, pret, gramaj, calorii, categorie, imagine from prajituri where 1=1"+conditie);
    client.query("select id, nume, pret, gramaj, calorii, categorie, imagine from prajituri where 1=1"+conditie, function(err,rez){
        console.log(err, rez);
        //console.log(rez.rows);
        client.query("select unnest(enum_range( null::categ_prajitura)) as categ", function(err,rezCateg){//selectez toate valorile posibile din enum-ul categ_prajitura

            console.log(rezCateg);
            res.render("pagini/produse", {produse:rez.rows, categorii:rezCateg.rows});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
            });
        
       
    });

    
});


//pagina proprie produsului
app.get("/produs/:id_prajitura",function(req, res){
    console.log(req.params);
    
    const rezultat= client.query("select * from prajituri where id="+req.params.id_prajitura, function(err,rez){
        //console.log(err, rez);
        console.log(rez.rows);
        res.render("pagini/produs", {prod:rez.rows[0]});//obiectul {a:10,b:20} poarta numele locals in ejs  (locals["a"] sau locals.a)
    });

    
});**/



app.get("/galerie.json",function(req, res){    
    res.status(403).render("pagini/403");

    
});


app.get("/*",function(req, res){    
    res.render("pagini"+req.url, function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                res.status(404).render("pagini/404");
            }
            else 
                throw err;
        }
        else{
            res.send(rezultatRandare);
        }
    });
});

//////
app.get("*/galerie-animata.css",function(req, res){
    /*Atentie modul de rezolvare din acest app.get() este strict pentru a demonstra niste tehnici
    si nu pentru ca ar fi cel mai eficient mod de rezolvare*/
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resources/scss/galerie_animata.scss").toString("utf-8");//citesc scss-ul cs string
    culori=["navy","black","purple","grey"]
    let culoareAleatoare =culori[Math.floor(Math.random()*culori.length)];//iau o culoare aleatoare pentru border
    let rezScss=ejs.render(sirScss,{culoare:culoareAleatoare});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
  //  console.log(rezScss);
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
           // console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
           // console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
       // console.log(`stdout: ${stdout}`);
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });

});
//////

function getSeason(){
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');

 //   mm="12";
    if (mm=="03" || mm=="04" || mm=="05")
        return "primavara";
    
    if (mm=="06" || mm=="07" || mm=="08")
        return "vara";

    if (mm=="09" || mm=="10" || mm=="11")
        return "toamna";


    return "iarna";

}

function getRandom()
{
    min = 3;
    max = 6;
    return Math.floor(Math.random() * (max - min) + min);
}

verificaImagini();

app.listen(8080);


console.log("Serverul a pornit!");
