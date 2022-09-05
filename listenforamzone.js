const express = require('express');
const app = express();
const {
  v4: uuidv4
} = require('uuid');
const port = process.env.port || 3030;
let mysql = require('mysql');
const puppeteer = require('puppeteer');

// Your database credentials here same with the laravel app.
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product_search_one_for_all',
});

// Now let's create a server that will listen to our port.
const server = app.listen(`${port}`, () => {
  console.log(`Server started on port ${port}`);
  // Connect to our database.
  connection.connect();
});

// Intialize Socket
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

// Setup Socket IO.
let name_product;
let price_product;

io.on('connection', (socket) => {
  console.log('Client connected for amazone!');
  // socket.on('');

  //  console.log(socket.data);
  socket.on("hello", (arg) => {
    console.log(arg.name_product);
    console.log(arg.price_product);
    name_product = arg.name_product;
    price_product = arg.price_product;
  });
  //send data result
  socket.emit("hello2", "ebbana2");
  // Listener when user emit a order event
  //declar data container for amazone ebay aliexpresse
  let amazon;
  /* amazon=[
     {
       link: 'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_atf_aps_sr_pg1_1?ie=UTF8&adId=A00151102XBKEMNZB2GT4&url=%2FRedragon-M602-Ergonomic-High-Precision-Programmable%2Fdp%2FB011HMDZ0Q%2Fref%3Dsr_1_1_sspa%3Fcrid%3D3RXFQ521GKERT%26keywords%3Dmouse%26qid%3D1660727844%26refinements%3Dp_36%253A-5000%26rnid%3D386442011%26sprefix%3Dmouse%252Caps%252C510%26sr%3D8-1-spons%26psc%3D1&qualifier=1660727844&id=877969400135041&widgetName=sp_atf',
       name: 'Redragon M602 RGB Wired Gaming Mouse RGB Spectrum Backlit Ergonomic Mouse Griffin Programmable with 7 Backlight Modes up to 7200 DPI for Windows PC Gamers (Black)',
       price: '$16.99',
       image_Url: 'https://m.media-amazon.com/images/I/61MI2KPnKgL._AC_UY218_.jpg'
     },
     {
       link: 'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_atf_aps_sr_pg1_1?ie=UTF8&adId=A05935742SQJCFHZG4A64&url=%2FWireless-Trueque-Ergonomic-Adjustable-Chromebook%2Fdp%2FB09JSH81HZ%2Fref%3Dsr_1_2_sspa%3Fcrid%3D3RXFQ521GKERT%26keywords%3Dmouse%26qid%3D1660727844%26refinements%3Dp_36%253A-5000%26rnid%3D386442011%26sprefix%3Dmouse%252Caps%252C510%26sr%3D8-2-spons%26psc%3D1&qualifier=1660727844&id=877969400135041&widgetName=sp_atf',
       name: 'Wireless Mouse for Laptop, Trueque 2.4GHz Ergonomic Computer Mouse with 3 Adjustable DPI Levels, Page Up &amp; Down Buttons, USB Mouse for Chromebook, PC, Desktop, Notebook, MacBook (Grey)',
       price: '$11.99',
       image_Url: 'https://m.media-amazon.com/images/I/51nWKMSox+L._AC_UY218_.jpg'
     },
     {
       link: 'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_mtf_aps_sr_pg1_1?ie=UTF8&adId=A08610462BWKTGIYSSGI0&url=%2FWireless-Rechargeable-Bluetooth-Portable-Computer%2Fdp%2FB08SMQB6TF%2Fref%3Dsr_1_7_sspa%3Fcrid%3D3RXFQ521GKERT%26keywords%3Dmouse%26qid%3D1660727844%26refinements%3Dp_36%253A-5000%26rnid%3D386442011%26sprefix%3Dmouse%252Caps%252C510%26sr%3D8-7-spons%26psc%3D1&qualifier=1660727844&id877969400135041&widgetName=sp_mtf',
       name: 'LED Wireless Mouse, Slim Rechargeable Silent Bluetooth Mouse, Portable USB Optical 2.4G Wireless Bluetooth Two Mode Computer Mice with USB Receiver and Type C Adapter (Black)',
       price: '$6.96',
       image_Url: 'https://m.media-amazon.com/images/I/61U4Qj2jqmL._AC_UY218_.jpg'
     },
     {
       link: 'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_mtf_aps_sr_pg1_1?ie=UTF8&adId=A0669372A3QZLT3XZWRR&url=%2FTECKNET-6-Button-Ergonomic-Chromebook-Notebook-Grey%2Fdp%2FB01BC4TXXC%2Fref%3Dsr_1_12_sspa%3Fcrid%3D3RXFQ521GKERT%26keywords%3Dmouse%26qid%3D1660727844%26refinements%3Dp_36%253A-5000%26rnid%3D386442011%26sprefix%3Dmouse%252Caps%252C510%26sr%3D8-12-spons%26psc%3D1%26smid%3DA32ZXSC69MZ8DX&qualifier=1660727844&id=877969400135041&widgetName=sp_mtf',
       name: 'TECKNET 6-Button USB Wired Mouse with Side Buttons, Optical Computer Mouse with 1000/2000DPI, Ergonomic Design, 5ft Cord, Support Laptop Chromebook PC Desktop Mac Notebook-Grey',
       price: '$9.99',
       image_Url: 'https://m.media-amazon.com/images/I/61VttqGYFZL._AC_UY218_.jpg'
     },
     {
       link: 'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_mtf_aps_sr_pg1_1?ie=UTF8&adId=A05136781JBFHXR4BD7CX&url=%2FTeckNet-Ergonomic-Wireless-Chromebook-Adjustment%2Fdp%2FB015NBTMMC%2Fref%3Dsr_1_17_sspa%3Fcrid%3D3RXFQ521GKERT%26keywords%3Dmouse%26qid%3D1660727844%26refinements%3Dp_36%253A-5000%26rnid%3D386442011%26sprefix%3Dmouse%252Caps%252C510%26sr%3D8-17-spons%26psc%3D1%26smid%3DA2B0XX6670RA4T&qualifier=1660727844&id=877969400135041&widgetName=sp_mtf',
       name: 'Wireless Mouse, TECKNET Pro 2.4G Ergonomic Wireless Optical Mouse with USB Nano Receiver for Laptop ,PC, Computer, Chromebook , Notebook ,6 Buttons,24 Months Battery Life, 2600 DPI, 5 Adjustment Levels',
       price: '$11.99',
       image_Url: 'https://m.media-amazon.com/images/I/61Xl9zQcfBL._AC_UY218_.jpg'
     },
     {
       link: 'https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=pa_sp_btf_aps_sr_pg1_1?ie=UTF8&adId=A013271321D02JNZ2H068&url=%2FWireless-Trueque-E702-Computer-Chromebook%2Fdp%2FB09HYVMFF8%2Fref%3Dsr_1_22_sspa%3Fcrid%3D3RXFQ521GKERT%26keywords%3Dmouse%26qid%3D1660727844%26refinements%3Dp_36%253A-5000%26rnid%3D386442011%26sprefix%3Dmouse%252Caps%252C510%26sr%3D8-22-spons%26psc%3D1%26smid%3DA15Q14ZBQIIB19&qualii er=1660727844&id=877969400135041&widgetName=sp_btf',
       name: 'Wireless Mouse - Trueque E702 2.4GHz Portable Computer Mouse with USB Receiver, Comfortable Silent Mice for Laptop, Chromebook, PC, Notebook, Desktop, Windows, Mac',
       price: '$9.98',
       image_Url: 'https://m.media-amazon.com/images/I/51BEYgznm-L._AC_UY218_.jpg'
     }
   ]
     */
       socket.emit("amazon", amazon);
  ///amazone get data

  try {
    (async () => {
      const browser = await puppeteer.launch({
        headless: false
      });
      const page = await browser.newPage();

      await page.goto('https://www.amazon.com');
      await page.goto('https://www.amazon.com');
      // Type into search box.
      await page.type('.nav-input.nav-progressive-attribute', name_product);
      const allResultsSelector = '.nav-search-submit-text';

      await page.waitForSelector(allResultsSelector);
      try {
        await page.click(allResultsSelector);
      } catch (e) {
        browser.close();
        console.log(e);
      }
      await page.waitForNavigation();
      console.log(page.url());

      /////////////////////////////


      // definde the price for product

      const Product_Price = '#high-price';

      await page.waitForSelector(Product_Price);
      try {
        await page.type(Product_Price, price_product);
      } catch (e) {
        browser.close();
        console.log(e);
      }
      await page.waitForSelector('#a-autoid-1-announce');
      try {
        await page.click('#a-autoid-1-announce');
      } catch (e) {
        browser.close();
        console.log(e);
      }
      await page.waitForNavigation();

      ///get product
      //                    .s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.AdHolder.sg-col.s-widget-spacing-small.sg-col-12-of-16  
      const produits_Select = '.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.s-widget-spacing-small.sg-col-4-of-20';
      await page.waitForSelector(produits_Select);
      const products = await page.$$(produits_Select);
      let myJSON = '[';
      let i = 0;
      for (let p of products) {
        try {

          let link_selector = '.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal';

          await p.waitForSelector(link_selector);
          let link = await (await (await p.$(link_selector)).getProperty('href')).jsonValue();

          //.a-size-medium.a-color-base.a-text-normal
          let name_selector = '.a-size-base-plus.a-color-base.a-text-normal';

          await p.waitForSelector(name_selector);
          let name = await (await (await p.$(name_selector)).getProperty('innerHTML')).jsonValue();
          //
          let price_selector = '.a-offscreen';

          await p.waitForSelector(price_selector);
          let price = await (await (await p.$(price_selector)).getProperty('innerHTML')).jsonValue();

          //
          let image_selector = '.s-image';

          await p.waitForSelector(image_selector);
          let image = await (await (await p.$(image_selector)).getProperty('src')).jsonValue();
          //create json to svae data
          let pro = {
            link: link,
            name: name,
            price: price,
            image_Url: image
          };
          if (i < 1) {
            myJSON += JSON.stringify(pro);
          } else {
            myJSON += ',' + JSON.stringify(pro);
          }
          //console.log(pro);

        } catch (e) {
          browser.close();
          console.log(`Could not get the productfrom amazone becausof :`, e.message);
        }
        i++;
        if (i > 6) {
          break;
        }
      }
      myJSON += ']';

      const myfile_product_amazon_file = JSON.parse(myJSON);
      console.log(myfile_product_amazon_file);
      amazon = myfile_product_amazon_file;
      socket.emit("amazon", amazon);
      await browser.close();

    })();

  } catch (e) {
    browser.close();
     amazon=[];
     socket.emit("amazon", amazon); 
    console.log('scraping amzone did not completed')
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected for amazone!');
  });
}); 