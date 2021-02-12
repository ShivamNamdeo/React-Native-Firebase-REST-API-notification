export const sendPushNotification = async ({user_name,act,token,timestamp,user_pic}) => {
  const FIREBASE_API_KEY = "AAAAYmKAysc:APA91bHXOHmfF-qLvLVT4dsmWC74NMjx2uIwbw3RmgNgHMoJS8_oaQ_MOjWwLGPDXjou905wjuMTnpscZQuVw0ZMcaNnPd7a4GBB_JVTto_sLPd7ModS4uXAtjN481_5OaA3hAnJqWlh"
  const message = {
    registration_ids: [
      token,
    ],
    notification: {
      title: user_name,
      body: act,
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      priority: "high",
      content_available: true,
    },
    data: {
      title:user_name,
      body: act,
      timestamp:timestamp,
      user_pic:user_pic,
    },
  }

  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "key=" + 'AAAAYmKAysc:APA91bHXOHmfF-qLvLVT4dsmWC74NMjx2uIwbw3RmgNgHMoJS8_oaQ_MOjWwLGPDXjou905wjuMTnpscZQuVw0ZMcaNnPd7a4GBB_JVTto_sLPd7ModS4uXAtjN481_5OaA3hAnJqWlh',
  })

  let response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers,
    body: JSON.stringify(message),
  })
  response = await response.json()
  console.log(response)
}