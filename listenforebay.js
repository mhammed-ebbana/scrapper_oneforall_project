const express = require('express');
const app = express();
const { v4 : uuidv4 } = require('uuid');
const port = process.env.port || 3031;
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
    console.log('Client connected for ebay!');
    // socket.on('');
  
 //  console.log(socket.data);
 socket.on("hello", (arg) => {
    console.log(arg.name_product);
    console.log(arg.price_product); 
    name_product=arg.name_product;
    price_product=arg.price_product;
  }); 
  //send data result
  socket.emit("hello1", "ebay"); 
    // Listener when user emit a order event
    //declar data container for amazone ebay aliexpresse

    let ebay;

///ebay get data

try{
    (async () => {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
    
        await page.goto('https://www.ebay.com/sch/i.html?_from=R40&_nkw='+name_product+'&_sacat=0&rt=nc&_udhi='+price_product);
        await page.goto('https://www.ebay.com/sch/i.html?_from=R40&_nkw='+name_product+'&_sacat=0&rt=nc&_udhi='+price_product);
   
      ///get product
      
      const  produits_Select='.s-item.s-item__pl-on-bottom.s-item--watch-at-corner';
      await page.waitForSelector(produits_Select);
        const products = await page.$$(produits_Select);
      let myJSON='[';
      let i=0;
      for( let p of products ) {
          try {
      
              let link_selector ='.s-item__link';
              
              await p.waitForSelector(link_selector);
              let link= await(await ( await p.$(link_selector) ).getProperty('href')).jsonValue() ;
             
              //
              let name_selector ='.s-item__title';
              
              await p.waitForSelector(name_selector);
              let name= await(await ( await p.$(name_selector) ).getProperty('innerHTML')).jsonValue() ;
              //
              let price_selector ='.s-item__price';
              
              await p.waitForSelector(price_selector);
              let price= await(await ( await p.$(price_selector) ).getProperty('innerHTML')).jsonValue() ;
      
              //
              let image_selector ='.s-item__image-img';
              
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
              {myJSON += JSON.stringify(pro);}
              else
             { myJSON += ','+JSON.stringify(pro);} 
              //console.log(pro);
       
          }
          catch( e ) {
            browser.close();
              console.log( `Could not get the productfrom amazone becausof :`, e.message );
          }
          i++;
          if(i>6)
          {
            break;
          }
      }
      myJSON+=']';
      
      const myfile_product_ebay_file= JSON.parse(myJSON);
      console.log(myfile_product_ebay_file);
    ebay = myfile_product_ebay_file;
   await browser.close();
    socket.emit("ebay", ebay); 
      })();
      
    }catch(e){
        browser.close();
        ebay=[];
socket.emit("ebay", ebay); 
        console.log('scraping ebay did not completed')
    }
/*
ebay=[
    {
      link: 'https://www.ebay.com/itm/394203055920?hash=item5bc8554730:g:wS4AAOSw2vBi-zCN&amdata=enc%3AAQAHAAAA4Kd4JnXYJ55VpspEruOp%2BnDPhk8kfioP4uVMxWi7OB7LRoPMtsR0zyajGpxdHRoCNs8Rqd5eQO1kMbjLUyo9paquPlZf4m%2FmN60OCH9fPqu3bpIhpF397Svhh9ThXlXiG2yf3wFIpaAKnc3XqaCXKnpVvCuj0nhV3DCzVArj8D6le340GYnWl5h%2Fk4U%2F4dDHvi44QBWDiOWSxGTSJal9XludtyFZuI2SXBBJTWJz2uIJ1%2Be6BvZM3xjnF7uCswukfj3Wb9hb%2BZeBjXdtbFxd3VS%2FapIy%2BVgWgoj6GmjeNAhe%7Ctkp%3ABFBMpOKN6NRg',     
      name: 'Wall Outlet To Triple USB Power Adapter - Wall Charger For Smartphones (USB-C)',
      price: '$10.99',
      image_Url: 'data/image/product_pc.jpg'
     },
    {
      link: 'https://www.ebay.com/itm/175303234805?hash=item28d0e314f5:g:yasAAOSwNVpilnkG&amdata=enc%3AAQAHAAAAoO2x%2ByKQAXCbLj4C0dV%2Bemmz10EHswFgMOfqycq6u68j8TSQW9jNKSl9fv9zEhcnbkdG9UpeWLLnI83wbXAujAe6%2FAPvjy3zqa6oIHzua3i1UkQ5j4sylD6ls0MjVb9uaCPvp6yRUUIaiIZZ5OsjpR%2BV9h3TAFdWYl7KH%2BRge63FeUg%2Fm6NYNuMaHEgxkP0ScQN3av4ii9bV0MTfG2AGAyU%3D%7Ctkp%3ABk9SR6TijejUYA',
      name: 'samsung galaxy m12 unlocked smartphone 32gb black',
      price: '$132.87',
      image_Url: 'data/image/product_pc.jpg'
    },
    {
      link: 'https://www.ebay.com/itm/384907315241?epid=12047060217&hash=item599e438829:g:FKEAAOSwD-liTxAg&amdata=enc%3AAQAHAAAA4HIV5%2Bbs4bx38cFn%2Fz9TpV%2BHoZ8XYJ2v%2BxcdXmSDCLo2WikfHmB2FsF87PxH9yAW8JLObhtY%2F4ZL0XfJOcCYbQ6yQcIQCDWPZyR13pVMnRGZucsugQ8X1Pw%2F14o0TfQM6XwvWN2I%2FM394jzNE6LViWrr49pUMjRYZzLi9fCcQLhpBRDBGUTqeuaDaWCKFzWHZBynPTwowEFOijGWnJ6axENkdMuGAJG1qIPoEPseLy0MdpX7d8mGtllCqLZ14G0XFqRyMX9Py1kRWaVfi7XUMSy5wdCDBg3J1XjtfW3eXq9Q%7Ctkp%3ABk9SR6TijejUYA',
      name: 'Samsung Galaxy M12 Smartphone Mobile Phone 64 GB, Android, Green, Quad Camera ✅ New &amp; Original Packaging ✅',
      price: '$169.18',
      image_Url: 'data/image/product_pc.jpg'
    },
    {
      link: 'https://www.ebay.com/itm/304413839996?epid=12047060217&hash=item46e07a927c:g:1FEAAOSwfzBiPtui&amdata=enc%3AAQAHAAAAoEX9PULAVO5VnHNKrbG77qf%2BQzUzDC4jCQUqo4zQ8VZwicJ%2FGUT8xNE0TjFcxX5RjwD%2BnoBx47ofvM6O78cbGkdhAR9H2L0N98ge2yjW0p3R39UgQoAHI3X8R91%2FkgbCIb3vEf9GFIjLlRBw5Mr6%2FRv6djDbwR0rJzdTYCGc6O7eEUK%2BK6uTtZ7n11Vv8YObuZRuOfWoc%2BwCbKmfIuS8qdg%3D%7Ctkp%3ABk9SR6TijejUYA',
      name: '� Samsung Galaxy M12 - 64GB-Green-DUAL SIM without SIMLOCK NEW &amp; ORIGINAL PACKAGING �',
      price: '$159.02',
      image_Url: 'data/image/product_pc.jpg'
    },
    {
      link: 'https://www.ebay.com/itm/403621798257?epid=28047076203&hash=item5df9bbe171:g:RYMAAOSwMvViZdV3&amdata=enc%3AAQAHAAAA4NA4iJCGXgYl3RuHAKot4Bp2FVlz%2Fdbrmxk5r%2BwL9h3J2ZEmUKHfr6ka2WK5IV1Musj6Os9dtXYuR10kTKD3kRx%2BF87g9po2kxv9PbVBbKGZw8FSgGSS8VjipA%2BGbMN0L%2Fhzg4ikcm1GkcZoGxJBaahHbx4cXRnP4%2FPetymtHHWSUIzOnQB2NKcdCpGXQrzDiOhfCl6gN7sDD3Vuz4mR9E8Y%2BPx0t4j55qAdNuytbqlWwpmO5vDl9I%2FqrIVcUMCXjH0KvN3h5vFjmzd2TLXsmiHDRonikuJvczVKBWVwkEZQ%7Ctkp%3Ak9SR6TijejUYA',
      name: 'Samsung galaxy m12 sm-m127f/dsn 6.5" - 64go-black (unlocked) (dual sim) EU',
      price: '$192.68',
      image_Url: 'data/image/product_pc.jpg'
     },
    {
      link: 'https://www.ebay.com/itm/374199830664?hash=item57200c4888:g:28AAAOSw2E9i6mGF&amdata=enc%3AAQAHAAAA4JojuZPFmH1M6R4ncYtUpNa2Tq5oyvllrwCPyosxbB%2BPcrszmA7ZMq7O4fiFWKwn6W2PDpFN%2BEeFO924WDXhZtx6Upd1ICBLRGy%2BPrlmeBzw4y32f8sUamzOAdZTj%2FkI4IZUtk1amh%2BEuwLoFyPmINYR3a9fOzqsfNVqulZgWgzzDKEvM1MRYqWEXC04%2B2Ku4JwXAUZT5widkXAinL0MlsYnsNuDfmluNOuw1eMNSWqF4q6eyozpg4GwqGFvt4sMYDi7DjnbeGcp1jeJoJpkHYuedorn0q%2BM%2Fh%2FDAICSz7T8%7Ctkp%3ABk9SR6TijejUYA', 
      name: 'Used Samsung Galaxy M12 Blue 4GB 64GB 6000 mAh Fingerprint Face Network Unlocked',
      price: '$175.00',
      image_Url: 'data/image/product_pc.jpg'
    },
    {
      link: 'https://www.ebay.com/itm/134194847227?hash=item1f3ea2ddfb:g:LwIAAOSwmCFi8OWe&amdata=enc%3AAQAHAAAAoCB9g%2FDDhljZGTMDA544I7bArvqlqADhkmYn7QJl%2FMo01Rhadfhxo9IDnnIp3DSKFsz6VsGw1VF9UiXJeQR6y9ZSxeas192cMPfcSZISGNc9%2F8TgLokZHonNQW6xCiF%2FQZTq1VsYWHw%2FfTb527QCX%2FBZRHOwhg5g44uzXAIPIn4ERYNzgo4%2BvB9xu2rabMeNYyCVB2NsXaw9qWkiqcRXuc8%3D%7Ctkp%3ABk9SR6TijejUYA',
      name: 'Samsung Galaxy M12 SM-M127F/DSN - 128GB - Blue (Unlocked) (DUAL SIM)',
      price: '$187.24',
      image_Url: 'data/image/product_pc.jpg'
    }
  ];
//
    socket.emit("ebay", ebay); */

    ////////
    socket.on('disconnect', () => {
        console.log('Client disconnected for ebay!');
    });
});

 
