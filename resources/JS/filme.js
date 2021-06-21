/*a=10
var raspuns=confirm("Iti place tehnici web?");
console.log(raspuns)*/
function checkStrings (s, t) {
    
    let aux=s;
    
    for(let i=0;i<s.length-1;i++)
    {
        aux=s.slice(0,i).concat(s[i+1]).concat(s[i])+s.slice(i+2,s.length);
        aux=aux.toLowerCase();
        console.log(aux);
        if(aux.localeCompare(t.toLowerCase())==0)
            return 1;
    }
    return 0;
}

window.onload=function(){

    var rng=document.getElementById("inp-pret");
	rng.parentNode.insertBefore(document.createTextNode(rng.min),rng);
	rng.parentNode.appendChild(document.createTextNode(rng.max));
    let spval=document.createElement("span");
	rng.parentNode.appendChild(spval)
    rng.value=0;
    spval.innerHTML=" ("+rng.value+")";
    rng.onchange=function(){
        rng.nextSibling.nextSibling.innerHTML=" ("+this.value+")";
    }

    let btn=document.getElementById("filtrare");
    btn.onclick=function(){


        let cntr=0;

        let inp=document.getElementById("inp-durata");
        let maxDurata = inp.value;

        
        inp=document.getElementById("inp-pret");
        let minPret=inp.value;

        let sel=document.getElementById("inp-categorie");
        let categorieSel=sel.value;

        sel2=document.getElementById("input-nume");
        let numeFilm=sel2.value;
       // alert(numeFilm);

        let textAreaVal=document.getElementById("input-actor").value;
        //textAreaVal="Vin Diesel";
       // alert(textAreaVal);
       
        
        //Primul filtru de actor
        var getSelectedValue1 = document.querySelector('input[name="radio1"]:checked');
        //console.log(getSelectedValue.value);
        var vinDiesel;
    

        vinDiesel="neutral";
        if(getSelectedValue1.value=="da")
            {vinDiesel="da";}
        else 
        if (getSelectedValue1.value=="nu")
            {vinDiesel="nu";}
        else
            {vinDiesel='neutral';}

        if(vinDiesel!="nu" && vinDiesel!="da")
            vinDiesel="neutral";

        getSelectedValue1 = document.querySelector('input[name="radio2"]:checked');
        var lebron;
        lebron="neutral";
        if(getSelectedValue1.value=="da")
            {lebron="da";}
        else 
        if (getSelectedValue1.value=="nu")
            {lebron="nu";}
        else
            {lebron='neutral';}

        if(lebron!="nu" && lebron!="da")
             lebron="neutral";

        getSelectedValue1 = document.querySelector('input[name="radio3"]:checked');
        var michelle;
        michelle="neutral";
        if(getSelectedValue1.value=="da")
            {michelle="da";}
        else 
        if (getSelectedValue1.value=="nu")
            {michelle="nu";}
        else
            {michelle='neutral';}

        if(michelle!="nu" && michelle!="da")
            michelle="neutral";

        getSelectedValue1 = document.querySelector('input[name="radio4"]:checked');
        var luisStan;
        luisStan="neutral";
        if(getSelectedValue1.value=="da")
            {luisStan="da";}
        else 
        if (getSelectedValue1.value=="nu")
            {luisStan="nu";}
        else
            {luisStan='neutral';}

        if(luisStan!="nu" && luisStan!="da")
            luisStan="neutral";


        getSelectedValue1 = document.querySelector('input[name="radio5"]:checked');
        var tomCruise;
        tomCruise="neutral";
        if(getSelectedValue1.value=="da")
            {tomCruise="da";}
        else 
        if (getSelectedValue1.value=="nu")
            {tomCruise="nu";}
        else
            {tomCruise='neutral';}

        if(tomCruise!="nu" && tomCruise!="da")
            tomCruise="neutral";    
        //alert(vinDiesel);
       // alert(isIt3d);
        let butonFN=document.getElementById("filme1");
        let butonFV=document.getElementById("filme2");

        let selected = document.querySelectorAll('#inp-multiplu option:checked');
        let values = Array.from(selected).map(el => el.value);
        //alert(values[0]);
        let minimV=parseInt(20);

       // alert(values[0]);
      // alert(values.length); 
       for(let idx=0;idx<values.length;idx++)
        {
            if(values[idx]!='18+' && parseInt(values[idx])<minimV) 
                minimV=parseInt(values[idx]);
        }

        //alert(minimV);
      //  sel=document.getElementById("inp-multiplu");
       // let categorii=sel.value;
        
        //alert(categorii);

        //sel=document.getElementById("filme1");
        //let filmeNoi=sel.value;

        

        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="none";
            let durata= parseInt(prod.getElementsByClassName("val-durata")[0].innerHTML)
            let conditie1= durata<=maxDurata;

            
            let pret= parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML)
            let conditie2= pret>=minPret;

         //   let categorieArt= prod.getElementsByClassName("val-categorie")[0].innerHTML
         //   let conditie3= (categorieArt==categorieSel || categorieSel=="toate");
            
            let treidA=prod.getElementsByClassName("val-treid")[0].innerHTML;
            let conditie4= ((treidA=="true" && categorieSel=="3D") || (treidA=="false" && categorieSel=="clasice") || (categorieSel=="toate"));
           // alert(categorieSel);
            let valNV=prod.getElementsByClassName("val-nv")[0].innerHTML;
            let conditie5=((!butonFN.checked && !butonFV.checked) || (valNV=="filme noi" && butonFN.checked) || (valNV=="filme vechi" && butonFV.checked))
            
            let numeCurent=prod.getElementsByClassName("val-nume")[0].innerHTML;
            let conditie6=(numeFilm=="" || numeCurent.localeCompare(numeFilm)==0 || checkStrings(numeFilm,numeCurent))
            

            let varsta=parseInt(prod.getElementsByClassName("val-varsta")[0].innerHTML);
            
            let conditie7=(minimV>=varsta);
            

            let ok=0;
            let listaActori=prod.getElementsByClassName("hiddenact");
            let ok1=0;
            let ok2=0;
            let ok3=0;
            let ok4=0;
            let ok5=0;
            //okDict[1]=okDict[2]=0;

            for(let i=0;i<listaActori.length;i++)
            {
                if(listaActori[i].innerHTML.localeCompare("Vin Diesel")==0)
                    ok1=1;
                if(listaActori[i].innerHTML.localeCompare("LeBron James")==0)
                    ok2=1;
                if(listaActori[i].innerHTML.localeCompare("Michelle Rodriguez")==0)
                    ok3=1;
                if(listaActori[i].innerHTML.localeCompare("Lewis Tan")==0)
                    ok4=1;
                if(listaActori[i].innerHTML.localeCompare("Tom Cruise")==0)
                    ok5=1;
                if(listaActori[i].innerHTML.localeCompare(textAreaVal)==0)
                {
                    ok=1;
                    break;
                }
            }
            let conditie8=(textAreaVal=="" || ok==1);

            let conditie9=((vinDiesel=="neutral") || (vinDiesel=="da" && ok1==1) || (vinDiesel=="nu" && ok1==0));
            
            let conditie10=((lebron=="neutral") || (lebron=="da" && ok2==1) || (lebron=="nu" && ok2==0));
            let conditie11=((michelle=="neutral") || (michelle=="da" && ok3==1) || (michelle=="nu" && ok3==0));
            let conditie12=((luisStan=="neutral") || (luisStan=="da" && ok4==1) || (luisStan=="nu" && ok4==0));
            let conditie13=((tomCruise=="neutral") || (tomCruise=="da" && ok5==1) || (tomCruise=="nu" && ok5==0));
            let conditieFinala=(conditie1 && conditie2 && conditie4 && conditie5 && conditie6 && conditie7  && conditie9 && conditie10 &&  conditie11 && conditie12 && conditie13);
            
            if (conditieFinala)
            
            {
                prod.style.display="block";
                cntr++;
            }
        }

        if(!cntr) alert("Nu avem niciun film pe placul dumneavoastra");
    }


    function sortArticole(factor){
        
        var produse=document.getElementsByClassName("produs");
        let arrayProduse=Array.from(produse);
        arrayProduse.sort(function(art1,art2){
            let nume1=art1.getElementsByClassName("val-pret")[0].innerHTML;
            let nume2=art2.getElementsByClassName("val-pret")[0].innerHTML;

            if(nume1==nume2)
            {
                let categorie1=art1.getElementsByClassName("val-categorie")[0].innerHTML;
                let categorie2=art2.getElementsByClassName("val-categorie")[0].innerHTML;
                return factor*categorie1.localeCompare(categorie2);
            }
            
            return factor*nume1.localeCompare(nume2);
            /*
            let rez=factor*nume1.localeCompare(nume2)
            if (rez==0)
                retrun factor*(pret1-pret2)
            return rez;
            */
        });
       // console.log(arrayProduse); 
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    btn=document.getElementById("sortCrescNume");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescrescNume");
    btn.onclick=function(){
        sortArticole(-1);
    }

    btn=document.getElementById("resetare");
    btn.onclick=function(){
        document.getElementById("input-nume").value="";
        for(let i=0;i<5;i++)
            {document.getElementsByClassName("oricare")[i].checked=true;}
        
        document.getElementById("inp-pret").value="0";
        document.getElementById("inp-durata").value="300";

        document.getElementById("inp-categorie").selectedIndex=0;
        document.getElementById("input-actor").value="";
        document.getElementById("inp-multiplu").selectedIndex=0;
        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="block";
        }
    }


    btn=document.getElementById("suma");
    btn.onclick=function()
    {
        var produse=document.getElementsByClassName("produs");
        var sumaArt=0.0;
        for (let prod of produse){
            if(prod.style.display!="none")
            sumaArt+=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
        }
        let infoSuma=document.createElement("p");//<p></p>
        infoSuma.innerHTML="Suma biletelor selectate este: "+sumaArt;//<p>...</p>
        infoSuma.className="info-produse";
        let p=document.getElementById("p-suma");
        p.parentNode.insertBefore(infoSuma,p.nextSibling);
        setTimeout(function(){infoSuma.remove()}, 2000);

    }
   /**  window.onkeydown=function(e){
        
       
        if (e.key=="c" && e.altKey){
            e.preventDefault();
            var produse=document.getElementsByClassName("produs");
            sumaArt=0;
            for (let prod of produse){
                if(prod.style.display!="none")sumaArt+=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            let infoSuma=document.createElement("p");//<p></p>
            infoSuma.innerHTML="Suma: "+sumaArt;//<p>...</p>
            infoSuma.className="info-produse";
            let p=document.getElementById("p-suma")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            setTimeout(function(){infoSuma.remove()}, 2000);
        }
    }**/

}