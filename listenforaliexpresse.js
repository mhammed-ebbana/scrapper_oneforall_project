const express = require('express');
const app = express();
const { v4 : uuidv4 } = require('uuid');
const port = process.env.port || 3032;
let mysql = require('mysql');
const puppeteer = require('puppeteer');
 
// Your database credentials here same with the laravel app.
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'product_search_one_for_all',
});

// Now let's create a server that will listen to our port.
const server = app.listen(`${port}`, () => {
    console.log(`Server started on port ${port}`);
    // Connect to our database.
    connection.connect();
});

// Intialize Socket
const io = require("socket.io")(server, {
    cors : { origin : "*" }
});

// Setup Socket IO.
let name_product;
let price_product;

io.on('connection', (socket) => {
    console.log('Client connected for aliexpesse!');
    // socket.on('');
  
 //  console.log(socket.data);
 socket.on("hello", (arg) => {
    console.log(arg.name_product);
    console.log(arg.price_product); 
    name_product=arg.name_product;
    price_product=arg.price_product;
  }); 
  //send data result
  socket.emit("hello3", "ebbana3"); 
    // Listener when user emit a order event
    //declar data container for amazone ebay aliexpress bangood
    let aliexpress;

///ali get data

try{
    (async () => {
        const browser = await puppeteer.launch({headless:false});
         const page = await browser.newPage();
      
        // await page.goto('https://www.aliexpress.com/wholesale?trafficChannel=main&d=y&SearchText='+name_product+'&ltype=wholesale&SortType=default&maxPrice='+price_product+'&page=1&CatId=0');
        await page.goto('https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20220825025816&SearchText=shose&spm=a2g0o.productlist.1000002.0');
        await page.waitForNavigation(); 
        /*await page.goto('https://www.aliexpress.com/wholesale?SearchText='+name_product+'&maxPrice='+price_product+'&page=1');
        await page.waitForNavigation();*/



        // await page.waitForSelector('.search-button');
        //   await page.click('.search-button'); 
        //   await page.waitForNavigation();



          
        /*await page.goto('https://www.aliexpress.com');
        await page.waitForNavigation();
        await page.goto('https://www.aliexpress.com');
        await page.waitForNavigation();
        await page.goto('https://www.aliexpress.com');
        await page.waitForNavigation();
        
        await page.waitForSelector('._24EHh');
        
          await page.click('._24EHh'); 
     
           

        await page.type('.search-key', name_product);
        const allResultsSelector = '.search-button';
       
        await page.waitForSelector(allResultsSelector);
      try
       {
        await page.click(allResultsSelector); 
       }
      catch(e)
      {
        browser.close();
        console.log(e);
      }
        await page.waitForNavigation();
        console.log(page.url());
      
        /////////////////////////////
      
        
        // definde the price for product
      
        const Product_Price = '.next-input.next-small input';
       
        await page.waitForSelector(Product_Price);
      try{
        await page.type(Product_Price,price_product);
      }
      catch(e)
      {
        browser.close();
        console.log(e);
      }
        await page.waitForSelector('.ui-button.narrow-go');
        try{
        await page.click('.ui-button.narrow-go');
        }
        catch(e)
        {
          browser.close();
            console.log(e);
          }
        await page.waitForNavigation();
      */
        // Type into search box.
    
    

      
        /////////////////////////////
      
        
        // definde the price for product
      
      

     
        //await page.waitForNavigation(); 
       
        /// stars top level
       // console.log(page.$(stars_top_level).textContent);
      
      ///get product
      
      const  produits_Select='._3t7zg._2f4Ho';
      await page.waitForSelector(produits_Select);
        const products = await page.$$(produits_Select);
      let myJSON='[';
      let i=0;
      for( let p of products ) {
          try {
      
              let link_selector ='._3t7zg._2f4Ho';
              
              await p.waitForSelector(link_selector);
              let link= await(await ( await p.$(link_selector) ).getProperty('href')).jsonValue() ;
             
              // 
              let name_selector ='._18_85';
              
              await p.waitForSelector(name_selector);
              let name= await(await ( await p.$(name_selector) ).getProperty('innerHTML')).jsonValue() ;
              //
              let price_selector ='.mGXnE._37W_B';
              
              await p.waitForSelector(price_selector);
              let price= await(await ( await p.$(price_selector) ).getProperty('innerHTML')).jsonValue() ;
      
              //
              let image_selector ='._1RtJV.product-img';
              
              await p.waitForSelector(image_selector);
              let image= await(await ( await p.$(image_selector) ).getProperty('src')).jsonValue() ;

              //create json to svae data

              let pro={
                link:link,
                name:name,
                price:price,
                image_Url:image
              };

                if(i<1)
              {
                myJSON += JSON.stringify(pro);
              }
                 else
                 {
                   myJSON += ','+JSON.stringify(pro);
                 } 

               //console.log(pro);
                
          }
          catch( e ) {
            browser.close();
              console.log( `Could not get the productfrom aliexpress becausof :`, e.message );
          }
          i++;
          if(i>6)
          {
            break;
          }
      }
      myJSON+=']';
      
      const myfile_product_aliexpress_file= JSON.parse(myJSON);
      console.log(myfile_product_aliexpress_file);
      aliexpress = myfile_product_aliexpress_file;
   await browser.close();
    socket.emit("aliexpress", aliexpress); 
      })();
      
    }catch(e){
        browser.close();
        aliexpress=[];
        socket.emit("aliexpress", aliexpress); 
        console.log('scraping aliexpress did not completed')
    }
   // amazon=[{'kasd':54}];
  
    socket.emit("aliexpress", aliexpress); 
    ////////
    socket.on('disconnect', () => {
        console.log('Client disconnected for aliexpesse!');
    });
});


 