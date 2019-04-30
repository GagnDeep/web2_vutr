const rp = require('request-promise');
const cheerio = require('cheerio');
const url = [];
let fs = require('fs');

fs.writeFile('./dataArr.js', "modules.exports = [", function(err){
      if(err) throw err;
})

let rollnumerRange = [50000, 20000];
let arr = [];
const dataArr = [];
// setTimeout(writeFile,10000)

let id = setInterval(()=>{
    rollnumerRange[0] +=100
    rollnumerRange[1] = rollnumerRange[0] + 100
    
    let url = createUrls("11075586", [rollnumerRange[0], rollnumerRange[1]]);
    resolve(url);
    
    if(rollnumerRange[0] == 60000){
        clearInterval(id)
        // fs.appendFile('./dataArr.js', "];", function(err){
        //   if(err) throw err;
        // })
    }
},5000)

const createUrls = (id, range)=>{
    let url = [];
    for(let i = range[0]; i<=range[1];i++){
        url.push(
            rp(`http://pupdepartments.ac.in/puexam/t2/results/results.php?rslstid=${id}&ROLL=${i}&submit=Submit`)
            .catch(err=>err)
            );
            console.log(i+"\n")
    }
    return url;
}

const resolve = (url) => {
    Promise.all(url).then(function(html){
        html.forEach((e,i)=>{
            
            let $ = cheerio.load(e);
            if($('#divContentInnerPrint').text().indexOf('No Result Found!') === -1){
                    let data = {}
                    studentInfo($,data);
                    // result($,data);
                    console.log(data)
                    writeFile(data);
            }
            
        })
        
    
    }).catch(err=>console.log(err))
}


    
    
    
    
    function studentInfo($,data){
        
        $('td.c3').each(function(i, e){
            if(i === 0) data['Name'] = $(e).text();
            if(i === 1) data['Course'] = $(e).text();
            
        })
        
        $('table.noborder span').each(function(i,e){
          let arr = $(e).text().split('.');
          data[arr[0].split(' ').join('')] = arr[1];
        });
    }
    
    function result($,data){
        const result = [];
        $('#resultTbl tr').each(function(i, e){
            if(i!=0){
                let resultStr = ''
                $(e).find('td').each(function(i,e){
                    if(i !== 0){
                        resultStr += $(e).text()+','
                    }
                })
                
                result.push(new resultClass(resultStr))
            }
        })
        // console.log(result)
        let i = result.findIndex(e => e.subject === ' ');
        if(i) result.splice(i, 1);
        
        data['result'] = result;
        data['pass'] = result.every(e=>e.pass);
    }
    
    class resultClass{
        constructor(resultStr){
            let arr = resultStr.split(',');
        
            this.subject = arr[1];
            this.internal = typeCheck(arr[2]);
            this.external = typeCheck(arr[3]);
            this.total = typeCheck(arr[4]);
            
            if(this.subject === 'Drug Abuse:Problem'){
                    
                    this.subject = arr[1] + ' '+arr[2];
                    this.internal = typeCheck(arr[3]);
                    this.external = typeCheck(arr[4]);
                    this.total = 0;
                    this.pass = true;
                }
            
            
            if(this.internal && this.external && this.total ){
                this.pass = true;
            }else{
                this.pass = false;
                
            } 
            if(this.subject == 'Drug Abuse:Problem Mgt.& Prevention (Qualified)')
                this.pass = true;
        }
    }
    
    function typeCheck(str){
        if(parseInt(str)){
            return +str;
        }
        return null;
    }

function writeFile(data){
    let string = JSON.stringify(data) + ","
    fs.appendFile('./dataArr.js', string, function(err){
      if(err) throw err;
    })
}
