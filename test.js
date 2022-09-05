const puppeteer = require('puppeteer');
    (async () => {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
      
        await page.goto('https://www.ebay.com/sch/i.html?_from=R40&_nkw=pfds&_sacat=0&rt=nc&_udhi=516');

        const Product_Price = '.textbox.x-textrange__input x-textrange__input--to .textbox__control';
        
        await page.waitForSelector(Product_Price);
 
        await page.type(Product_Price,"600");
    
  /*
        
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
              console.log( `Could not get the product from ebay becausof :`, e.message );
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
   await browser.close();*/
    //socket.emit("ebay", ebay); 
      })();
      