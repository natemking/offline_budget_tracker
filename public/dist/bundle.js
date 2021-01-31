/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/assets/js/chart.js":
/*!***********************************!*\
  !*** ./public/assets/js/chart.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"populateChart\": () => (/* binding */ populateChart),\n/* harmony export */   \"populateDonut\": () => (/* binding */ populateDonut)\n/* harmony export */ });\nlet myChart;\nlet myDonut; //Populate the chart w/ the transaction data\n\nconst populateChart = transactions => {\n  // copy array and reverse it\n  let reversed = transactions.slice().reverse();\n  let sum = 0; // create date labels for chart\n\n  let labels = reversed.map(t => {\n    let date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  let data = reversed.map(t => {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  let ctx = document.getElementById('myChart').getContext('2d');\n  myChart = new Chart(ctx, {\n    type: 'line',\n    data: {\n      labels,\n      datasets: [{\n        label: 'Total Over Time',\n        fill: true,\n        backgroundColor: '#e0afa0',\n        data\n      }]\n    },\n    options: {\n      responsive: true\n    }\n  });\n}; //Populate the donut chart w/ only expense catagories\n\nconst populateDonut = transactions => {\n  //Color array for donut chart\n  const colors = ['#463f3a', '#8a817c', '#758b69', '#bcb8b1', '#4f0113', '#b991c9', '#e0afa0', '#c6949a', '#a27f93', '#7a6c86', '#525a72', '#2f4858', '#006796', '#546fa7', '#9177a9', '#ba84a4', '#d4979e', '#aac19d', '#e56d4b', '#f4f3ee']; //Filter out all category and values that are not income\n\n  let catValue = [];\n  transactions.forEach(t => {\n    if (t.category !== 'income') {\n      catValue.push({\n        [t.category]: t.value\n      });\n    }\n  }); //Reduce the results so that any duplicate catagories are returned as one and their values combined\n\n  const data = catValue.reduce((finalObj, obj) => {\n    for (const [category, value] of Object.entries(obj)) {\n      if (!finalObj[category]) {\n        finalObj[category] = 0;\n      }\n\n      finalObj[category] += value;\n    }\n\n    return finalObj;\n  }, {}); //If donut chart exists delete\n\n  if (myDonut) {\n    myDonut.destroy();\n  } //Context variable for chart location in DOM\n\n\n  const ctx = document.getElementById('myDonut').getContext('2d'); //Create donut chart with user data\n\n  myDonut = new Chart(ctx, {\n    type: 'doughnut',\n    data: {\n      labels: Object.keys(data).reverse(),\n      datasets: [{\n        label: 'Total Spending by Category',\n        backgroundColor: colors,\n        data: Object.values(data).reverse()\n      }]\n    },\n    options: {\n      title: {\n        display: true,\n        text: 'Total Spending by Category'\n      }\n    }\n  });\n};\n\n//# sourceURL=webpack://follow-your-money/./public/assets/js/chart.js?");

/***/ }),

/***/ "./public/assets/js/index.js":
/*!***********************************!*\
  !*** ./public/assets/js/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _indexedDB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./indexedDB */ \"./public/assets/js/indexedDB.js\");\n/* harmony import */ var _total__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./total */ \"./public/assets/js/total.js\");\n/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table */ \"./public/assets/js/table.js\");\n/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chart */ \"./public/assets/js/chart.js\");\n//*** Modules ***//\n//===============//\n\n\n\n\n //*** API ***//\n//===========//\n//Get the transactions data from the server and update table/totals/charts\n\nlet transactions = [];\n\n(async () => {\n  try {\n    //Fetch the data from the server\n    const response = await fetch('/api/transaction'); //Assign the transactions var w/ the extracted JSON body content of the response\n\n    transactions = await response.json(); //Call the functions to add the data to the DOM\n\n    (0,_total__WEBPACK_IMPORTED_MODULE_1__.populateTotal)(transactions);\n    (0,_table__WEBPACK_IMPORTED_MODULE_2__.populateTable)(transactions);\n    (0,_chart__WEBPACK_IMPORTED_MODULE_3__.populateChart)(transactions);\n    (0,_chart__WEBPACK_IMPORTED_MODULE_3__.populateDonut)(transactions);\n  } catch (err) {\n    err => console.error(err);\n  }\n})(); //Send the newly added transaction data to the server and update table/totals/charts\n\n\nconst sendTransaction = isAdding => {\n  let nameEl = document.querySelector('#t-name');\n  let catEl = document.querySelector('#t-cat');\n  let amountEl = document.querySelector('#t-amount');\n  let errorEl = document.querySelector('.form .error'); //Validate form\n\n  if (nameEl.value === '' || catEl.value === '' || amountEl.value === '') {\n    errorEl.textContent = 'Missing Information';\n    return;\n  } else {\n    errorEl.textContent = '';\n  } //Create record\n\n\n  let transaction = {\n    name: nameEl.value,\n    category: catEl.value.trim().toLowerCase(),\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; //If subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } //Add to beginning of current array of data\n\n\n  transactions.unshift(transaction); //Re-run logic to populate ui with new record\n\n  (0,_chart__WEBPACK_IMPORTED_MODULE_3__.populateChart)(transactions);\n  (0,_chart__WEBPACK_IMPORTED_MODULE_3__.populateDonut)(transactions);\n  (0,_table__WEBPACK_IMPORTED_MODULE_2__.populateTable)(transactions);\n  (0,_total__WEBPACK_IMPORTED_MODULE_1__.populateTotal)(transactions); //Also send to server\n\n  (async () => {\n    try {\n      //Send transaction data to server\n      const response = await fetch('/api/transaction', {\n        method: 'POST',\n        body: JSON.stringify(transaction),\n        headers: {\n          Accept: 'application/json, text/plain, */*',\n          'Content-Type': 'application/json'\n        }\n      }); //Assign extracted JSON body content to var\n\n      const data = await response.json(); //If any errors, display warning to user, else clear the form data\n\n      data.errors ? errorEl.textContent = 'Missing Information' : // clear form\n      nameEl.value = '';\n      catEl.value = '';\n      amountEl.value = '';\n    } catch (err) {\n      // fetch failed, so save in indexed db\n      (0,_indexedDB__WEBPACK_IMPORTED_MODULE_0__.saveRecord)(transaction); // clear form\n\n      nameEl.value = '';\n      catEl.value = '';\n      amountEl.value = '';\n    }\n  })();\n}; //*** Event Listeners ***//\n//=======================//\n//Add transaction if add button is clicked\n\n\ndocument.querySelector('#add-btn').onclick = function () {\n  sendTransaction(true);\n}; //Subtract transaction is subtract button is clicked\n\n\ndocument.querySelector('#sub-btn').onclick = function () {\n  sendTransaction(false);\n};\n\n//# sourceURL=webpack://follow-your-money/./public/assets/js/index.js?");

/***/ }),

/***/ "./public/assets/js/indexedDB.js":
/*!***************************************!*\
  !*** ./public/assets/js/indexedDB.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"saveRecord\": () => (/* binding */ saveRecord)\n/* harmony export */ });\nlet db; //Create a new db request for a \"budget\" database.\n\nconst request = indexedDB.open(\"budget\", 1);\n\nrequest.onupgradeneeded = function (event) {\n  //Create object store called \"pending\" and set autoIncrement to true\n  const db = event.target.result;\n  db.createObjectStore(\"pending\", {\n    autoIncrement: true\n  });\n};\n\nrequest.onsuccess = function (event) {\n  db = event.target.result; //Check if app is online before reading from db\n\n  if (navigator.onLine) {\n    checkDatabase();\n  }\n};\n\nrequest.onerror = function (event) {\n  console.log(\"Oh NO! \" + event.target.errorCode);\n}; //Export function for use in indexedDB\n\n\nfunction saveRecord(record) {\n  //Create a transaction on the pending db with readwrite access\n  const transaction = db.transaction([\"pending\"], \"readwrite\"); //Access your pending object store\n\n  const store = transaction.objectStore(\"pending\"); //Add record to your store with add method.\n\n  store.add(record);\n}\n\nfunction checkDatabase() {\n  //Open a transaction on your pending db\n  const transaction = db.transaction([\"pending\"], \"readwrite\"); //Access your pending object store\n\n  const store = transaction.objectStore(\"pending\"); //Get all records from store and set to a variable\n\n  const getAll = store.getAll();\n\n  getAll.onsuccess = function () {\n    if (getAll.result.length > 0) {\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      }).then(response => response.json()).then(() => {\n        //If successful, open a transaction on your pending db\n        const transaction = db.transaction([\"pending\"], \"readwrite\"); //Access your pending object store\n\n        const store = transaction.objectStore(\"pending\"); //Clear all items in your store\n\n        store.clear();\n      });\n    }\n  };\n} //Listen for app coming back online\n\n\nwindow.addEventListener(\"online\", checkDatabase);\n\n//# sourceURL=webpack://follow-your-money/./public/assets/js/indexedDB.js?");

/***/ }),

/***/ "./public/assets/js/table.js":
/*!***********************************!*\
  !*** ./public/assets/js/table.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"populateTable\": () => (/* binding */ populateTable)\n/* harmony export */ });\n//Populate the table with the transactions data\nfunction populateTable(transactions) {\n  let tbody = document.querySelector('#tbody');\n  tbody.innerHTML = ''; //Iterate over all trans and populate table rows w/ formatted dates, names, catagories with upper-cased first letter of each word, & values\n\n  transactions.forEach(transaction => {\n    let tr = document.createElement('tr');\n    tr.innerHTML = \"\\n      <td id='date'>\".concat(transaction.date.slice(5, 7), \"/\").concat(transaction.date.slice(8, 10), \"/\").concat(transaction.date.slice(2, 4), \"</td>\\n      <td>\").concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.category.replace(/(^\\w{1})|(\\s+\\w{1})/g, letter => letter.toUpperCase()), \"</td>\\n      <td>$\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\n//# sourceURL=webpack://follow-your-money/./public/assets/js/table.js?");

/***/ }),

/***/ "./public/assets/js/total.js":
/*!***********************************!*\
  !*** ./public/assets/js/total.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"populateTotal\": () => (/* binding */ populateTotal)\n/* harmony export */ });\n//Function to populate the total amount of all transactions\nconst populateTotal = transactions => {\n  // reduce transaction amounts to a single total value\n  let total = transactions.reduce((total, t) => {\n    return total + parseInt(t.value);\n  }, 0);\n  let totalEl = document.querySelector('#total');\n  totalEl.textContent = total;\n};\n\n//# sourceURL=webpack://follow-your-money/./public/assets/js/total.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./public/assets/js/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;