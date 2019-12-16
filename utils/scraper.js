const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "donkjzkrh",
  api_key: "685594282271774",
  api_secret: "xxNghu7mOOGGQbRHEx1B5qkeo_s"
});

const scrapeData = async id => {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process"
    ],
    headless: true,
    defaultViewport: null
  });
  const page = await browser.newPage();
  await page.goto("https://evarsity.srmist.edu.in/srmsip/");

  // const scrapedData = await page.evaluate(() => )
  if (id == 1) {
    const captcha = await getCaptcha(0, page);
    const pattern = await getCaptcha(1, page);
    return { captcha: captcha, pattern: pattern, browser: browser, page: page };
  } else {
    console.log("scraper.js" + id);
  }
  // await({ path: "./captcha.jpg" });
  // console.log("ok");

  // await page.waitFor(10000);

  // // click the Login Button
};

const getCaptcha = async (val, page) => {
  if (val == 0) {
    const captcha = await page.$("#cpimg1");
    await page.waitFor(1000);
    let shotResult = await captcha
      .screenshot()
      .then(result => {
        console.log(`got some results.`);
        return result;
      })
      .catch(e => {
        console.error(`Error in snapshotting news`, e);
        return false;
      });

    if (shotResult) {
      // browser.close();
      const cloudinary_options = {
        public_id: `captcha/captcha`
      };
      return cloundinaryPromise(shotResult, cloudinary_options);
    } else {
      return null;
    }
  } else {
    try {
      const captcha_pattern = await page.$("#sdivcolor");
      await page.waitFor(1500);

      let shotResult = await captcha_pattern
        .screenshot()
        .then(result => {
          console.log(`got some results.`);
          return result;
        })
        .catch(e => {
          console.error(`Error in snapshotting news`);
          return false;
        });

      if (shotResult) {
        // browser.close();
        const cloudinary_options = {
          public_id: `captcha_pattern/captcha_pattern`
        };
        return cloundinaryPromise(shotResult, cloudinary_options);
      } else {
        throw "No Pattern";
      }
    } catch (e) {
      console.log(e);
      return "No Pattern";
    }
  }
};

function cloundinaryPromise(shotResult, cloudinary_options) {
  return new Promise(function(res, rej) {
    cloudinary.v2.uploader
      .upload_stream(cloudinary_options, function(error, cloudinary_result) {
        if (error) {
          console.error("Upload to cloudinary failed: ", error);
          rej(error);
        }
        console.log(cloudinary_result);
        console.log(cloudinary.width);
        console.log(cloudinary.height);

        res(cloudinary_result);
      })
      .end(shotResult);
  });
}

const insertData = async (id, pass, code, browser, page) => {
  // console.log(browser);
  const regNo = await page.$x(
    "/html/body/div[1]/table/tbody/tr[2]/td[2]/div/table/tbody/tr/td/form/table/tbody/tr[2]/td/input"
  );
  await regNo[0].type(id);

  const password = await page.$x(
    "/html/body/div[1]/table/tbody/tr[2]/td[2]/div/table/tbody/tr/td/form/table/tbody/tr[3]/td/input"
  );
  await password[0].type(pass);

  const captcha_code = await page.$x(
    "/html/body/div[1]/table/tbody/tr[2]/td[2]/div/table/tbody/tr/td/form/table/tbody/tr[6]/td/input"
  );
  await captcha_code[0].type(code);

  await page.click(
    "#loginform1 > table > tbody > tr:nth-child(7) > td > input.btn"
  );

  // const forceLogin = page.$("#btnNew");
  //TODO: work on the Force Login Issue;
  if (await page.$("#btnNew")) {
    const forceLogin = await page.$("#btnNew");
    await forceLogin.click();
    console.log("force");
  } else {
    console.log("else");
    const attendance = await page.waitForSelector("#dm0m0i2tdT");
    await attendance.click();
    const attendance1 = await page.waitForSelector("#dm0m2i2tdT");
    await attendance1.click();
  }
};

module.exports.scrapeData = scrapeData;
module.exports.insertData = insertData;
