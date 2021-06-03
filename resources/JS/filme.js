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

        var getSelectedValue = document.querySelector('input[name="tip-film"]:checked');
        //console.log(getSelectedValue.value);
        let isIt3d;
        isIt3d="neutral";
        if(getSelectedValue.value=="treid")
            {isIt3d="true";}
        else 
        if (getSelectedValue.value=="clasic")
            {isIt3d="false";}
        else
            {isIt3d='neutral';}

        if(isIt3d!="false" && isIt3d!="true")
            isIt3d="neutral";

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

            let categorieArt= prod.getElementsByClassName("val-categorie")[0].innerHTML
            let conditie3= (categorieArt==categorieSel || categorieSel=="toate");
            
            let treidA=prod.getElementsByClassName("val-treid")[0].innerHTML;
            let conditie4= ((treidA=="true" && isIt3d=="true") || (treidA=="false" && isIt3d=="false") || (isIt3d=="neutral"));

            let valNV=prod.getElementsByClassName("val-nv")[0].innerHTML;
            let conditie5=((!butonFN.checked && !butonFV.checked) || (valNV=="filme noi" && butonFN.checked) || (valNV=="filme vechi" && butonFV.checked))
            
            let numeCurent=prod.getElementsByClassName("val-nume")[0].innerHTML;
            let conditie6=(numeFilm=="" || numeCurent.localeCompare(numeFilm)==0 || checkStrings(numeFilm,numeCurent))
            

            let varsta=parseInt(prod.getElementsByClassName("val-varsta")[0].innerHTML);
            
            let conditie7=(minimV>=varsta);
            let conditieFinala=(conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6 && conditie7);
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