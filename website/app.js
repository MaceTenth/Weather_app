// Openweathermap api key and adress
const baseURL = "http://api.openweathermap.org/data/2.5/weather?";
const countryCode = "US";
const apiKey = "7c85131122d8ef595bbdb72f75b00d32";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

// Getting Form information
const submitButton = document.querySelector("#generate");
const zip = document.querySelector("#zip");
const thougts = document.querySelector("#thougts");
const options = document.querySelector("select");
let zipCodeOptions = "";

// Container where the data will be updated on the UI
const containerDiv = document.querySelector("#entryHolder");

function validate() {
  if (isNaN(zip.value)) {
    alert("Zip Code should be a number");
    zip.focus();
    zip.style.backgroundColor = "rgb(250, 95, 57)";
    zip.style.color = "black";
    return;
  }

  if (zip.value === "") {
    alert("Please enter a complete Zip code");
    zip.focus();
    zip.style.backgroundColor = "rgb(250, 95, 57)";
    zip.style.color = "black";
    return;
  }

  if (zip.value.length < 5) {
    alert("Please enter a five digit Zip code");
    zip.focus();
    zip.style.backgroundColor = "rgb(250, 95, 57)";
    zip.style.color = "black";
    return;
  }
}

zip.addEventListener("change", validate);

options.addEventListener("change", function (event) {
  zipCodeOptions = event.target.value;
});

function weaterApp() {
  //   Update UI function
  const updateUI = async () => {
    const request = await fetch("/all");

    try {
      const returnedData = await request.json();

      let last = returnedData.data.length - 1;
      containerDiv.innerHTML = `The temperature of ${returnedData.data[last].currentDate}
       in your area is: ${returnedData.data[last].temperature}
      and your wish for today is to:  ${returnedData.data[last].userResponse}
      `;

      //   reset form
      zip.value = "";
      thougts.value = "";
    } catch (error) {
      console.error("Update UI error", error);
    }
  };

  submitButton.addEventListener("click", (event) => {
    const thougtsContent = thougts.value;
    const zipCode = zip.value || zipCodeOptions;

    if (zipCodeOptions === "") {
      validate();
    }

    event.preventDefault();

    // Get request
    const getWeather = async (baseURL, zipCode, countryCode, apiKey) => {
      const urlToFetch = `${baseURL}zip=${zipCode},${countryCode}&units=metric&appid=${apiKey}`;
      const response = await fetch(urlToFetch);

      try {
        const data = await response.json();

        return data;
      } catch (error) {
        console.error("Error", error);
      }
    };

    // Post request
    const postData = async (url = "", data = {}) => {
      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      try {
        const newData = await response.json();
        return newData;
      } catch (error) {
        console.log("error", error);
      }
    };

    //   Chaining of Promises
    getWeather(baseURL, zipCode, countryCode, apiKey)
      .then((data) => {
        if (data.main !== undefined) {
          data.main.currentTime = newDate;
          data.main.userResponse = thougtsContent;
        } else {
          validate();
        }

        postData("/database", data);
      })
      .then(() => {
        updateUI();
      });
  });
}

weaterApp();
