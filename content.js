console.log("content.js")


chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(function(response) {
        console.log("我收到了")
        console.log(response.msg)
    })

});

