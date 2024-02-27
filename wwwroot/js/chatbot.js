$(document).ready(function () {
    //$('#bot-circle').on('click', OpenChatBox);

    const circle = document.getElementById('bot-circle');
    const box = document.getElementById('chat-bot-box');
    //const body = document.querySelector('body');

    //body.style.overflowX = 'hidden';

    LoadDefaultMessage();

    circle.addEventListener('click', () => {

        box.classList.add('active');
        //body.style.overflow = 'auto';
    });

    document.addEventListener('click', (event) => {
        if (!box.contains(event.target) && !circle.contains(event.target)) {
            box.classList.remove('active');
            //body.style.overflow = 'hidden';
        }
    });
});


//function OpenChatBox() {
//    $('#chat-bot-box').css('display', 'block');
//}

function LoadDefaultMessage() {
    const defaultMessage = "Hello i'm ChatGPT, how may i help you?"

    const bot_chat = $('#bot_chat');
    $(bot_chat).append("<div class='bot_chat_message assistant-message new-message'>" + defaultMessage + "</div>");
}

function SendPromptChatBot() {
    prompt = $('#chat-bot-input').val();

    GenerateUserText(prompt);
    $('#chat-bot-input').val("");

    const bot_chat = $('#bot_chat');
    $('.new-message.assistant-message').removeClass('new-message');
    $(bot_chat).append("<div class='bot_chat_message assistant-message new-message'></div>");
    LoaderChatGPT();
    bot_chat.scrollTop(bot_chat[0].scrollHeight);

    return $.ajax({
        url: "/Home/CallGPT",
        type: "POST",
        data: { prompt: prompt, mode: "chatgpt" },
        dataType: "json",
        async: true,
        success: function (result) {
            // Handle the success result here
            //console.log(result);
            GptResponse_ChatGPT(result);
        },
        error: function (xhr, textStatus, errorThrown) {
            // Handle the error here
            console.log(textStatus);
        }
    });
}

function GptResponse_ChatGPT(response) {
    //$('.loading-spinner').css('display', 'none');

    //$('#gpt_response').css('text-align', 'left');
    GenerateText_ChatGPT(response);

}


function GenerateText_ChatGPT(text) {
    const words = text.split(" ");
    let wordIndex = 0;

    //const bot_chat = document.getElementById('bot_chat');
    const bot_chat = $('#bot_chat');

    const response_box = document.getElementsByClassName('new-message')[1];
    response_box.innerHTML = "";

    const interval = setInterval(() => {
        if (wordIndex < words.length) {
            response_box.innerHTML += words[wordIndex] + ' ';
            wordIndex++;

            const intervalTime = Math.floor(Math.random() * 2000) + 1000;

            setTimeout(() => {
                if (wordIndex < words.length) {
                    response_box.innerHTML += words[wordIndex] + ' ';
                    wordIndex++;
                    bot_chat.scrollTop(bot_chat[0].scrollHeight);
                }
            }, intervalTime);
        }
        else {
            clearInterval(interval);
        }
    }, 50);

}


function GenerateUserText(text) {
    const bot_chat = $('#bot_chat');

    $('.new-message.user-message').removeClass('new-message');

    $(bot_chat).append("<div class='bot_chat_message user-message new-message'>" + text + "</div>");

    //const myDiv = document.getElementById("myDiv");
    bot_chat.scrollTop(bot_chat[0].scrollHeight);

}

function LoaderChatGPT() {
    const response_box = document.getElementsByClassName('new-message')[1];
    response_box.innerHTML = "<div class='dots'></div>";
}