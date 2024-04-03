import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsement-databse-default-rtdb.firebaseio.com/"
}

const endorsementEl = document.querySelector("#endorsement-el")
const pusblishBtn = document.querySelector("#publish-btn")
const postContainer = document.querySelector("#post-container")
const fromEl = document.querySelector("#from-el")
const toEl = document.querySelector("#to-el")
const app = initializeApp(appSettings)
const database = getDatabase(app)

const endorsementsDB = ref(database, "endorsements")


pusblishBtn.addEventListener("click", function (){
    console.log("clicked")
    let endorsementValue = endorsementEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value
    let endorsement = {
        from: fromValue,
        to: toValue,
        endorsement: endorsementValue,
        likes: {
            numLikes: 0,
            liked: false,
        }
    } 
    push(endorsementsDB, endorsement)
    clearEndorsementMessage()

})

onValue(endorsementsDB, function (snapshot) {
    if(snapshot.exists()){
        let endorsementList = Object.entries(snapshot.val())
        
        clearEndorsementPostEl()        
        for(let i = endorsementList.length - 1; i >= 0; i--){
                
            let endorsement = endorsementList[i]
            //console.log(endorsementList[i][0])
            //console.log(endorsementList[i][1])
            //console.log("going to display from: ",endorsementList[i][1].from)
            //console.log("going to display liked: ",endorsementList[i][1].likes.liked)
            //console.log("going to display liked: ",endorsementList[i][1].likes.numLikes)
            appendEndorsementToMessageBoard(endorsement)
        }

    }else{
        postContainer.innerHTML = "no endorsements have been posted yet..."
    }
})

function clearEndorsementMessage() {
    endorsementEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function clearEndorsementPostEl(){
    postContainer.innerHTML = ""
}

function appendEndorsementToMessageBoard(endorsement){
    let paragraphsList = []
    const endorsementID = endorsement[0]
    const endorsementValue = endorsement[1]
    //console.log(endorsementID)
    //console.log(endorsementValue)
    let newEndorsementEl = document.createElement("div")
    newEndorsementEl.className = "post"

    for(let i = 0; i < 2; i++){
        let paragraph = document.createElement("p")
        newEndorsementEl.append(paragraph)
        paragraphsList.push(paragraph)
    }
    paragraphsList[0].className = "user"
    paragraphsList[0].textContent = `To: ${endorsementValue.to}`
    paragraphsList[1].textContent = endorsementValue.endorsement
    
    let likeContainer =  document.createElement("div")
    likeContainer.className = "like-from-container"

    let fromParagraph = document.createElement("p")
    fromParagraph.className = "user"
    fromParagraph.textContent = `From: ${endorsementValue.from}`
    likeContainer.append(fromParagraph)
    
    let likeBtn = document.createElement("div")
    likeBtn.className = "like-button"
    
    let heartBg = document.createElement("div")
    heartBg.className = "heart-bg"
    
    let heartIcon = document.createElement("div")
    heartIcon.className = "heart-icon"



    let numLikes = document.createElement("div")
    numLikes.className = "likes"
    numLikes.textContent = endorsementValue.likes.numLikes


    heartBg.append(heartIcon)
    likeBtn.append(heartBg)
    likeBtn.append(numLikes)
    likeContainer.append(likeBtn)

    if(endorsementValue.likes.liked){
        
        heartIcon.classList.toggle("likedA")
        console.log(heartIcon)
    }
   
    heartIcon.addEventListener( "click" ,function(){
        let exacValueUpdateOfEndorsementInDB = ref(database, `endorsements/${endorsementID}`)
        this.classList.toggle("liked")
        if(endorsementValue.likes.liked){    
            endorsementValue.likes.liked = false
            endorsementValue.likes.numLikes--
            update(exacValueUpdateOfEndorsementInDB, {likes: {
                liked: false,
                numLikes: endorsementValue.likes.numLikes
            } } )
        }else{      
            console.log(heartIcon)
            endorsementValue.likes.numLikes++
            endorsementValue.likes.liked = true
            
        }
        
        numLikes.textContent = endorsementValue.likes.numLikes;
        setTimeout(function (){
            update(exacValueUpdateOfEndorsementInDB, {likes: {
                liked: endorsementValue.likes.liked,
                numLikes: endorsementValue.likes.numLikes
            } } )
        }, 700)
        
        
    })
    newEndorsementEl.append(likeContainer)

    newEndorsementEl.addEventListener("dblclick", function(){
        let exactLocationOfEndorsementInDB = ref(database, `endorsements/${endorsementID}`)
        remove(exactLocationOfEndorsementInDB)
    })

    postContainer.append(newEndorsementEl)

}