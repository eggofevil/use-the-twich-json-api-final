var userLoginList = ['freecodecamp', 'y0nd', 'alohadancetv', 'silvername'],
  userList,
  indicators;

//set user info
function setUserInfo(streamsArray) {
  'use strict';
  indicators.forEach(function (currentValue) {
    var item,
      id = currentValue.id.slice(10),
      userDiv = document.querySelector('#user-' + id),//
      userDivStreamInfo = document.querySelector('#stream-' + id),
      startTime;
    for (item in streamsArray) {
      if (streamsArray.hasOwnProperty(item)) {
        
        if (id === streamsArray[item].user_id) {
          if (currentValue.classList.toString().indexOf('online') === -1) {
            currentValue.className += ' online';
          }
          userDiv.children[4].removeAttribute('disabled');
          userDivStreamInfo.children[0].textContent = 'Title: ' + streamsArray[item].title;
          userDivStreamInfo.children[1].textContent = 'Lang: ' + streamsArray[item].language;
          startTime = new Date(streamsArray[item].started_at.toString());
          userDivStreamInfo.children[2].textContent = 'Started at: ' + startTime.toLocaleString('ru-RU');
          break;
        }
        if (currentValue.classList.toString().indexOf('online') !== -1) {
          currentValue.classList.remove('online');
          currentValue.textContent = '';
        }
        userDiv.children[4].setAttribute('disabled', 'disabled');
        userDivStreamInfo.children[0].textContent = '';
        userDivStreamInfo.children[1].textContent = '';
        userDivStreamInfo.children[2].textContent = '';
      }
    }
  });
}

//monitoring streams
function streamMonitor() {
  'use strict';
  var streamInfoUrl = 'https://api.twitch.tv/helix/streams?',
    streamInfoReq = new XMLHttpRequest();
  userList.forEach(function (currentValue) {
    streamInfoUrl += '&user_login=' + currentValue.login;
  });
  streamInfoReq.open('GET', streamInfoUrl);
  streamInfoReq.setRequestHeader('Client-ID', 'h28g98nj1xzdtbuugr8cngcr60iavi');
  streamInfoReq.responseType = 'json';
  streamInfoReq.addEventListener('load', function (e) {
    if (streamInfoReq.status === 200) {
      setUserInfo(streamInfoReq.response.data);
    } else {
      console.log(e);
    }
  });
  streamInfoReq.send();
  setTimeout(streamMonitor, 60000);
}

//create userInfo divs
function createUserDivs() {
  'use strict';
  var streamers = document.querySelector('#streamers');
  userList.forEach(function (currentValue) {
    var userDiv = document.createElement('div'),
      userDivImg = document.createElement('img'),
      userDivName = document.createElement('div'),
      userDivShowInfoBtn = document.createElement('button'),
      userDivGoToPageBtn = document.createElement('button'),
      userDivIndicator = document.createElement('div'),
      userDivSeparator = document.createElement('div'),
      userDivStreamInfo = document.createElement('div'),
      userDivStreamInfoTitle = document.createElement('p'),
      userDivStreamInfoLang = document.createElement('p'),
      userDivStreamInfoStartedAt = document.createElement('p');
    
    userDiv.setAttribute('id', 'user-' + currentValue.id);
    userDiv.setAttribute('class', 'userDiv');
    userDivImg.setAttribute('src', currentValue.profile_image_url);
    userDivName.setAttribute('class', 'userDivName');
    userDivName.textContent = currentValue.display_name;
    userDivShowInfoBtn.textContent = 'Show stream info';
    userDivShowInfoBtn.setAttribute('disabled', 'disabled');
    userDivShowInfoBtn.addEventListener('click', function () {
      if (userDivStreamInfo.classList.toString().indexOf('hidden') !== -1) {
        userDivStreamInfo.classList.remove('hidden');
      } else {
        userDivStreamInfo.classList.add('hidden');
      }
    });
    userDivGoToPageBtn.textContent = 'Go to user page';
    userDivGoToPageBtn.addEventListener('click', function () {
      window.open('https://twitch.tv/' + currentValue.login, '_blank');
    });
    userDivSeparator.setAttribute('class', 'userDivSeparator');
    userDivIndicator.setAttribute('class', 'userDivIndicator offline');
    userDivIndicator.setAttribute('id', 'indicator-' + currentValue.id);
    userDivStreamInfo.setAttribute('class', 'userDivStream hidden');
    userDivStreamInfo.setAttribute('id', 'stream-' + currentValue.id);
    
    userDiv.appendChild(userDivImg);
    userDiv.appendChild(userDivName);
    userDiv.appendChild(userDivIndicator);
    userDiv.appendChild(userDivGoToPageBtn);
    userDiv.appendChild(userDivShowInfoBtn);
    userDiv.appendChild(userDivSeparator);
      
    userDivStreamInfo.appendChild(userDivStreamInfoTitle);
    userDivStreamInfo.appendChild(userDivStreamInfoLang);
    userDivStreamInfo.appendChild(userDivStreamInfoStartedAt);
    userDiv.appendChild(userDivStreamInfo);
    
    streamers.appendChild(userDiv);
  });
  indicators = document.querySelectorAll('.userDivIndicator');

  streamMonitor();
}

//get user list
function getUserList() {
  'use strict';
  var userInfoUrl = 'https://api.twitch.tv/helix/users?login=',
    userInfoReq = new XMLHttpRequest();
  userInfoUrl += userLoginList.join('&login=');
  userInfoReq.open('GET', userInfoUrl);
  userInfoReq.setRequestHeader('Client-ID', 'h28g98nj1xzdtbuugr8cngcr60iavi');
  userInfoReq.responseType = 'json';
  userInfoReq.addEventListener('load', function (e) {
    if (userInfoReq.status === 200) {
      userList = userInfoReq.response.data;
      createUserDivs();
    } else {
      console.log(e);
    }
  });
  userInfoReq.send();
}

getUserList();
