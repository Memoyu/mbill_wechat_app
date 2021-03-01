/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Copyright (C) 2017, hapjs.org. All rights reserved.\n */\nconst css = __webpack_require__(1); // eslint-disable-line no-unused-vars\n\n\nconst $ = (selector, elem) => {\n  return typeof elem === 'undefined' ? document.querySelector(selector) : elem.querySelector(selector);\n};\n\nfunction init() {\n  const qrImgId = '#j-qr-icon';\n  const $qrCodeImg = $(qrImgId);\n  const timeStamp = Date.now() % 1e5;\n  $qrCodeImg.src = `/qrcode?ws_id=${timeStamp}`;\n  bindEvents();\n}\n\nfunction bindEvents() {\n  const socket = io(location.origin); // eslint-disable-line no-undef\n\n  socket.on('appRegistered', data => {\n    console.info(`on receiving appRegistered message: ${JSON.stringify(data)}`);\n    updateTableElement(data);\n  });\n  socket.on('informUpdate', () => {\n    console.info('on receiving informUpdate');\n    appendUpdateInfo();\n  });\n}\n/**\n * 更新页面调试信息\n * @param data{ inspectorUrl, application }\n */\n\n\nfunction updateTableElement(data) {\n  const wrapper = '.inspector-link-panel';\n  const tplId = '#j-tpl-appinfo';\n  const $panelWrapper = $(wrapper);\n  const $tplAppInfoElem = $(tplId);\n  const $tbodyElem = $('tbody', $panelWrapper);\n  let tplTextContent = $tplAppInfoElem.textContent;\n  $panelWrapper.classList.add('hide');\n  const dataToFill = {\n    data_app_name: data.application,\n    data_href_value: data.inspectorUrl,\n    data_href_name: '进入调试页面'\n  };\n  Object.keys(dataToFill).forEach(key => {\n    tplTextContent = tplTextContent.replace(`{{${key}}}`, dataToFill[key]);\n  });\n  $tbodyElem.innerHTML = tplTextContent;\n  $panelWrapper.classList.remove('hide');\n}\n\nfunction appendUpdateInfo() {\n  const tplId = '#j-tpl-updatetip';\n  const wrapper = '.inform-tip-wrapper';\n  const $tplUpdateTipElem = $(tplId);\n  const $panelWrapper = $(wrapper);\n  $panelWrapper.innerHTML = $tplUpdateTipElem.textContent;\n}\n\ninit();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2pzL2luZGV4LmpzPzJhNTIiXSwibmFtZXMiOlsiY3NzIiwicmVxdWlyZSIsIiQiLCJzZWxlY3RvciIsImVsZW0iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbml0IiwicXJJbWdJZCIsIiRxckNvZGVJbWciLCJ0aW1lU3RhbXAiLCJEYXRlIiwibm93Iiwic3JjIiwiYmluZEV2ZW50cyIsInNvY2tldCIsImlvIiwibG9jYXRpb24iLCJvcmlnaW4iLCJvbiIsImRhdGEiLCJjb25zb2xlIiwiaW5mbyIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1cGRhdGVUYWJsZUVsZW1lbnQiLCJhcHBlbmRVcGRhdGVJbmZvIiwid3JhcHBlciIsInRwbElkIiwiJHBhbmVsV3JhcHBlciIsIiR0cGxBcHBJbmZvRWxlbSIsIiR0Ym9keUVsZW0iLCJ0cGxUZXh0Q29udGVudCIsInRleHRDb250ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiZGF0YVRvRmlsbCIsImRhdGFfYXBwX25hbWUiLCJhcHBsaWNhdGlvbiIsImRhdGFfaHJlZl92YWx1ZSIsImluc3BlY3RvclVybCIsImRhdGFfaHJlZl9uYW1lIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJyZXBsYWNlIiwiaW5uZXJIVE1MIiwicmVtb3ZlIiwiJHRwbFVwZGF0ZVRpcEVsZW0iXSwibWFwcGluZ3MiOiI7O0FBQUE7OztBQUlBLE1BQU1BLEdBQUcsR0FBR0MsbUJBQU8sQ0FBQyxDQUFELENBQW5CLEMsQ0FBOEM7OztBQUM5QyxNQUFNQyxDQUFDLEdBQUcsQ0FBQ0MsUUFBRCxFQUFXQyxJQUFYLEtBQW9CO0FBQzVCLFNBQU8sT0FBT0EsSUFBUCxLQUFnQixXQUFoQixHQUNIQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUJILFFBQXZCLENBREcsR0FFSEMsSUFBSSxDQUFDRSxhQUFMLENBQW1CSCxRQUFuQixDQUZKO0FBR0QsQ0FKRDs7QUFNQSxTQUFTSSxJQUFULEdBQWdCO0FBQ2QsUUFBTUMsT0FBTyxHQUFHLFlBQWhCO0FBQ0EsUUFBTUMsVUFBVSxHQUFHUCxDQUFDLENBQUNNLE9BQUQsQ0FBcEI7QUFDQSxRQUFNRSxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxLQUFhLEdBQS9CO0FBQ0FILFlBQVUsQ0FBQ0ksR0FBWCxHQUFrQixpQkFBZ0JILFNBQVUsRUFBNUM7QUFDQUksWUFBVTtBQUNYOztBQUVELFNBQVNBLFVBQVQsR0FBc0I7QUFDcEIsUUFBTUMsTUFBTSxHQUFHQyxFQUFFLENBQUNDLFFBQVEsQ0FBQ0MsTUFBVixDQUFqQixDQURvQixDQUNlOztBQUVuQ0gsUUFBTSxDQUFDSSxFQUFQLENBQVUsZUFBVixFQUEyQkMsSUFBSSxJQUFJO0FBQ2pDQyxXQUFPLENBQUNDLElBQVIsQ0FBYyx1Q0FBc0NDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSixJQUFmLENBQXFCLEVBQXpFO0FBQ0FLLHNCQUFrQixDQUFDTCxJQUFELENBQWxCO0FBQ0QsR0FIRDtBQUlBTCxRQUFNLENBQUNJLEVBQVAsQ0FBVSxjQUFWLEVBQTBCLE1BQU07QUFDOUJFLFdBQU8sQ0FBQ0MsSUFBUixDQUFhLDJCQUFiO0FBQ0FJLG9CQUFnQjtBQUNqQixHQUhEO0FBSUQ7QUFFRDs7Ozs7O0FBSUEsU0FBU0Qsa0JBQVQsQ0FBNEJMLElBQTVCLEVBQWtDO0FBQ2hDLFFBQU1PLE9BQU8sR0FBRyx1QkFBaEI7QUFDQSxRQUFNQyxLQUFLLEdBQUcsZ0JBQWQ7QUFDQSxRQUFNQyxhQUFhLEdBQUczQixDQUFDLENBQUN5QixPQUFELENBQXZCO0FBQ0EsUUFBTUcsZUFBZSxHQUFHNUIsQ0FBQyxDQUFDMEIsS0FBRCxDQUF6QjtBQUNBLFFBQU1HLFVBQVUsR0FBRzdCLENBQUMsQ0FBQyxPQUFELEVBQVUyQixhQUFWLENBQXBCO0FBQ0EsTUFBSUcsY0FBYyxHQUFHRixlQUFlLENBQUNHLFdBQXJDO0FBRUFKLGVBQWEsQ0FBQ0ssU0FBZCxDQUF3QkMsR0FBeEIsQ0FBNEIsTUFBNUI7QUFDQSxRQUFNQyxVQUFVLEdBQUc7QUFDakJDLGlCQUFhLEVBQUVqQixJQUFJLENBQUNrQixXQURIO0FBRWpCQyxtQkFBZSxFQUFFbkIsSUFBSSxDQUFDb0IsWUFGTDtBQUdqQkMsa0JBQWMsRUFBRTtBQUhDLEdBQW5CO0FBS0FDLFFBQU0sQ0FBQ0MsSUFBUCxDQUFZUCxVQUFaLEVBQXdCUSxPQUF4QixDQUFnQ0MsR0FBRyxJQUFJO0FBQ3JDYixrQkFBYyxHQUFHQSxjQUFjLENBQUNjLE9BQWYsQ0FBd0IsS0FBSUQsR0FBSSxJQUFoQyxFQUFxQ1QsVUFBVSxDQUFDUyxHQUFELENBQS9DLENBQWpCO0FBQ0QsR0FGRDtBQUlBZCxZQUFVLENBQUNnQixTQUFYLEdBQXVCZixjQUF2QjtBQUNBSCxlQUFhLENBQUNLLFNBQWQsQ0FBd0JjLE1BQXhCLENBQStCLE1BQS9CO0FBQ0Q7O0FBRUQsU0FBU3RCLGdCQUFULEdBQTRCO0FBQzFCLFFBQU1FLEtBQUssR0FBRyxrQkFBZDtBQUNBLFFBQU1ELE9BQU8sR0FBRyxxQkFBaEI7QUFDQSxRQUFNc0IsaUJBQWlCLEdBQUcvQyxDQUFDLENBQUMwQixLQUFELENBQTNCO0FBQ0EsUUFBTUMsYUFBYSxHQUFHM0IsQ0FBQyxDQUFDeUIsT0FBRCxDQUF2QjtBQUNBRSxlQUFhLENBQUNrQixTQUFkLEdBQTBCRSxpQkFBaUIsQ0FBQ2hCLFdBQTVDO0FBQ0Q7O0FBRUQxQixJQUFJIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoQykgMjAxNywgaGFwanMub3JnLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICovXG5cbmNvbnN0IGNzcyA9IHJlcXVpcmUoJy4uL2Nzcy9pbmRleC9pbmRleC5jc3MnKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5jb25zdCAkID0gKHNlbGVjdG9yLCBlbGVtKSA9PiB7XG4gIHJldHVybiB0eXBlb2YgZWxlbSA9PT0gJ3VuZGVmaW5lZCdcbiAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgOiBlbGVtLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGNvbnN0IHFySW1nSWQgPSAnI2otcXItaWNvbidcbiAgY29uc3QgJHFyQ29kZUltZyA9ICQocXJJbWdJZClcbiAgY29uc3QgdGltZVN0YW1wID0gRGF0ZS5ub3coKSAlIDFlNVxuICAkcXJDb2RlSW1nLnNyYyA9IGAvcXJjb2RlP3dzX2lkPSR7dGltZVN0YW1wfWBcbiAgYmluZEV2ZW50cygpXG59XG5cbmZ1bmN0aW9uIGJpbmRFdmVudHMoKSB7XG4gIGNvbnN0IHNvY2tldCA9IGlvKGxvY2F0aW9uLm9yaWdpbikgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4gIHNvY2tldC5vbignYXBwUmVnaXN0ZXJlZCcsIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUuaW5mbyhgb24gcmVjZWl2aW5nIGFwcFJlZ2lzdGVyZWQgbWVzc2FnZTogJHtKU09OLnN0cmluZ2lmeShkYXRhKX1gKVxuICAgIHVwZGF0ZVRhYmxlRWxlbWVudChkYXRhKVxuICB9KVxuICBzb2NrZXQub24oJ2luZm9ybVVwZGF0ZScsICgpID0+IHtcbiAgICBjb25zb2xlLmluZm8oJ29uIHJlY2VpdmluZyBpbmZvcm1VcGRhdGUnKVxuICAgIGFwcGVuZFVwZGF0ZUluZm8oKVxuICB9KVxufVxuXG4vKipcbiAqIOabtOaWsOmhtemdouiwg+ivleS/oeaBr1xuICogQHBhcmFtIGRhdGF7IGluc3BlY3RvclVybCwgYXBwbGljYXRpb24gfVxuICovXG5mdW5jdGlvbiB1cGRhdGVUYWJsZUVsZW1lbnQoZGF0YSkge1xuICBjb25zdCB3cmFwcGVyID0gJy5pbnNwZWN0b3ItbGluay1wYW5lbCdcbiAgY29uc3QgdHBsSWQgPSAnI2otdHBsLWFwcGluZm8nXG4gIGNvbnN0ICRwYW5lbFdyYXBwZXIgPSAkKHdyYXBwZXIpXG4gIGNvbnN0ICR0cGxBcHBJbmZvRWxlbSA9ICQodHBsSWQpXG4gIGNvbnN0ICR0Ym9keUVsZW0gPSAkKCd0Ym9keScsICRwYW5lbFdyYXBwZXIpXG4gIGxldCB0cGxUZXh0Q29udGVudCA9ICR0cGxBcHBJbmZvRWxlbS50ZXh0Q29udGVudFxuXG4gICRwYW5lbFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gIGNvbnN0IGRhdGFUb0ZpbGwgPSB7XG4gICAgZGF0YV9hcHBfbmFtZTogZGF0YS5hcHBsaWNhdGlvbixcbiAgICBkYXRhX2hyZWZfdmFsdWU6IGRhdGEuaW5zcGVjdG9yVXJsLFxuICAgIGRhdGFfaHJlZl9uYW1lOiAn6L+b5YWl6LCD6K+V6aG16Z2iJ1xuICB9XG4gIE9iamVjdC5rZXlzKGRhdGFUb0ZpbGwpLmZvckVhY2goa2V5ID0+IHtcbiAgICB0cGxUZXh0Q29udGVudCA9IHRwbFRleHRDb250ZW50LnJlcGxhY2UoYHt7JHtrZXl9fX1gLCBkYXRhVG9GaWxsW2tleV0pXG4gIH0pXG5cbiAgJHRib2R5RWxlbS5pbm5lckhUTUwgPSB0cGxUZXh0Q29udGVudFxuICAkcGFuZWxXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxufVxuXG5mdW5jdGlvbiBhcHBlbmRVcGRhdGVJbmZvKCkge1xuICBjb25zdCB0cGxJZCA9ICcjai10cGwtdXBkYXRldGlwJ1xuICBjb25zdCB3cmFwcGVyID0gJy5pbmZvcm0tdGlwLXdyYXBwZXInXG4gIGNvbnN0ICR0cGxVcGRhdGVUaXBFbGVtID0gJCh0cGxJZClcbiAgY29uc3QgJHBhbmVsV3JhcHBlciA9ICQod3JhcHBlcilcbiAgJHBhbmVsV3JhcHBlci5pbm5lckhUTUwgPSAkdHBsVXBkYXRlVGlwRWxlbS50ZXh0Q29udGVudFxufVxuXG5pbml0KClcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2Nzcy9pbmRleC9pbmRleC5jc3M/NjI5NiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);