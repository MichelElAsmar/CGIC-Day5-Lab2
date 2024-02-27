# Lab 2: Get Started with the OpenAI_API .NET SDK

---

> In this exercise, you will learn how to use the unofficial **OpenAI_API .NET SDK** to create a website, included in this lab are instructions to use the GPT text completion models, the ChatGPT conversation model and the image generation model.

### Prerequisites

- Knowledge of .Net Core, C# and the MVC architecture
- Basic knowledge of HTML, CSS and JavaScript
- Familiarity with Git and version control concepts
- Visual Studio Code with appropriate extensions for C#, Nuget and .NET Core development (or a similar IDE for building a .NET Core MVC website)

---

## Setting Up the Project in Visual Studio Code


1. Open Visual Studio Code.
2. Make sure you have already installed the necessary extensions for C#, Nuget, git and .NET core development.
3. Enter on your keyboard `Ctrl+Shift+P` to write the command.
4. Write and choose `Git: Clone` then you are asked to give a URL.
5. Enter the following URL :`https://github.com/KarimYazbeck/OpenAI-GPT`
6. Choose the directory where you want to clone this repository into.
7. Open this folder in your visual studio code

---
### Creating a new project

This step is not for the tutorial, and you can skip it if you want to follow along the lab instructions and you cloned the repository, this is future knowledge for creating a new project to use the SDK

1. Create a folder where you want to create your project.
2. Open Command Prompt.
3. Navigate to the folder where you want to create your project.
4. Run the following: `dotnet new console -o NameOfYourProject`.
5. Navigate to the folder you will find a new folder name same as the name you've given to your project.
6. To quickly access it in VSC, you can navigate to your project folder by running:
   `cd NameOfYourProject` this will change directory to the new folder
7. Now by running : `code ..` you will open the folder in VSC
8. You can find 2 files created, navigate to the file `Program.cs` you will see code pre-written to print ' Hello, World!'
9. To run the app you open a cmd in VSC in the folder where you have your .sln file by Right-Clicking on the main project folder and clicking on `Open in Integrated Terminal`
10.  You run this : `dotnet run` and Hello, World! should be displayed.

---

## Installing the NuGet Package for the SDK

1. In Visual Studio code, make sure you have the Nuget extension installed, enter on your keyboard `Ctrl+Shift+P` to enter the command.
2. Write and click on `NuGet Package Manager: Add Package`.
3. Add the name of the package you want to add.
4. In our case the package is an unofficial OpenAI named `OpenAIt`.
5. Choose the version you want to install preferably the latest version (1.10.0 currently).
6. Go to your `NameOfYourProject.csproj`file and the package should be included if it was successfully added.
7. You'll see it like this:
   ` <PackageReference Include="OpenAI" Version="1.10.0" /> `
   
---
## Storing our Secret API Key

Each user will get an API key to use when making a request to OpenAI, this key is confidential and shouldn't be shared, in case the key was compromised you should regenerate a new key, in our case we can get our API key from the OpenAI website

1. Go to [the OpenAI Platform](https://platform.openai.com/) (https://platform.openai.com/)
2. Login to your OpenAI account.
3. Hover over the left panel.
4. Choose `API keys`.
5. Here you can see your created API Keys, delete them, or create a new API Key.
6. Click on `+ Create new secret key`
7. Your new API Key should now be displayed, copy and paste it somewhere safe, because you will not be able to view it again.

> We have many options to store our API keys, in this lab we are going to add it directly as a string in our code, but keep in mind this is not a good practice when you want to share the code with someone else.
---
## Adding API functionality to our website

### Creating the Controller action

In the Controllers>HomeControllers.cs, under the _'Index'_ Action, add a new Action called _'CallGPT'_ (you can call it anything but in our case the ajax code in the view will send the prompts to an action in the Home controller called CallGPT, note that the name is case sensitive)

> **Note:** You will get an error when trying to call `GPT.GPT_response` because we have not created it yet, we will add it in the next step

```c#
public IActionResult Index(string mode = "normal")
{
    ViewBag.Mode = mode;
    return View();
}

// add the below action
[HttpPost]
public async Task<JsonResult> CallGPT(string prompt, string mode, string impersonator, int nbImages)
{
    var response = await GPT.GPT_response(prompt, mode, impersonator, nbImages);
    return Json(response);
}
```

> This action will take the user prompt from the view (along with some other parameters), call the GPT_response method in the `GPT` class, and return the response to the view

The parameters of this action are

1. `prompt` which stores the prompt written by the user
2. `mode` which stores the mode the user is in (ex: normal mode, impersonator mode, translator mode ...)
3. `impersonator` **(optional)** which is the character you want the bot to act like, this variable is used only in the 'impersonator' mode
4. `nbImages` **(optional)** which is the number of images specified by the user if using the 'image' mode to generate images

---

## Creating the 'GPT' class

1. In the Solution Explorer pane on the left, right-click on the _'Models'_ folder > New file... 
2. Name it `GPT.cs`
3. In the new 'GPT' file add the following code to import required libraries

```c#
using System;
using System.Threading.Tasks;
using OpenAI_API;
using OpenAI_API.Models;
using OpenAI_API.Completions;
using OpenAI_API.Images;
using System.Linq.Expressions;
```

4. Create your public class GPT with the following code below the libraries imported:

```c#
 public class GPT
    {
	    public static async Task<string> GPT_response(string prompt = "", string mode = "normal", string impersonator = "", int nbImages = 1)
        {
            OpenAIAPI api = new OpenAIAPI("<YOUR_API_KEY>");

            // prompt design below
        }
    }
```

> replace `<YOUR_API_KEY>` with your OpenAI secret API key:

```c#
// example
var apiKey = "sk_123456abC123XyZhgeroiswdhT9goifhseoi";
```

> This method will be called by the 'CallGPT' action in the Home controller whenever a user enters a prompt it returns the API response to the controller which in turn sends it to the view to display it for the user.

---
## Prompt Design

Before sending the prompt we can customize it and make it cleaner for the AI to understand it better

> We add a '?' after the prompt because the text completion model completes the sentence for us and might add it in the response text, we also add examples for the model to give better accuracy.

In the following code, we are checking what the mode is and designing the prompt based on it

```c#
// prompt design below
string fullPrompt = "";

if (mode == "normal")
{
    string botName = "Trainable";

            fullPrompt = "Act as personal assistant named " + botName + ", and respond to a person asking about: " + prompt + "?";        
}
else if (mode == "impersonate")
{
    // if the 'impersonate' field was left empty, act as Elon Musk, otherwise act as the person entered in the field
    if (!String.IsNullOrEmpty(impersonator))
    {
	    fullPrompt = "Your name is " + impersonator + ", and you will act as this and respond as if you're not an ai to this: " + prompt + "? example: What time is it?, It's currently 3:00 PM. Could you check my schedule for tomorrow?, Sure, your schedule for tomorrow is clear. Can you recommend a good restaurant nearby?, Certainly! I recommend trying out 'The Bistro' just a few blocks away.";
    }
    else
    {
	    fullPrompt = "Act as Elon Musk, and respond to a person asking this: " + prompt + "?, What's your latest project?, Our latest project involves developing sustainable energy solutions. How do you envision the future of space travel?, I see space travel becoming more accessible and eventually leading to colonization of other planets. What advice do you have for aspiring entrepreneurs?, Focus on solving important problems and never give up on your dreams.";
    }

} 
// Add the prompt designs for the new modes here
//else

// Prepare completion Request
```

## Sending the Request

After we designed the prompt, we can go ahead and define our CompletionRequest, the request using the API, we store the response in a variable (called completionResult in our case) and return the response text to the controller

```c#
        // Prepare completion Request
        var request = new CompletionRequest(
            prompt: prompt,
            model: Model.ChatGPTTurboInstruct,
            temperature: 0.5, //Randomness of the model, A higher temperature leads to more diverse but potentially less coherent output
            max_tokens: 1000
        );
        var CompletionResult = await api.Completions.CreateCompletionAsync(request);
        return CompletionResult.ToString();
```

That's it! Try to add a prompt in the website to see if your code is fully working! it will have bad response at first but we will fix that in a bit! receiving a response is what we need for now.

>To run your website open a terminal in the main project folder, run `dotnet run` and you should receive  something like that ` Now listening on: http://localhost:5116` you can either copy the link into your browser or you can hold on `Ctrl+Click` to go to the website.

If something went wrong you can try checking these:

- Is the 'CallGPT' action in the Home Controller working as expected? one way to check is by debugging it
- Ensure after copying the code snippet to fix indentation and the brackets {}
- Is the api key you provided right?
- Is the prompt design step working as expected? one way to check is by debugging it
- Is the Request step working? is the response getting back, you can also debug to read the response.
- If you checked these steps and couldn't find what's wrong, ask your instructor for help

---

## Adding new Modes to our Website

We can add any mode we can think of to our website.
In this lab we will add 3 more text modes before moving on to the image generation mode and the ChatGPT mode.
The 3 new text modes are:

- Movie Recommendation
- Translation
- Summarizer

In order to add these modes we have to:

1. Add them in our navbar (in the Views>Shared>`_Layout.cshtml` View)
2. Add them in our `Index.cshtml` View
3. Add the prompt design in the `GPT.cs` class

### Adding the new Modes to our Navbar

Open the `Views/Shared/_Layout.cshtml` file, and add the new modes in the `@* Add the new modes here *@` block

```html
@* Add the new modes here *@
<li class="nav-item">
  <a
    class="nav-link text-white"
    asp-area=""
    asp-controller="Home"
    asp-action="Index"
    asp-route-mode="movie"
    >Movies
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link text-white"
    asp-area=""
    asp-controller="Home"
    asp-action="Index"
    asp-route-mode="summarize"
    >Summarize
  </a>
</li>
<li class="nav-item">
  <a
    class="nav-link text-white"
    asp-area=""
    asp-controller="Home"
    asp-action="Index"
    asp-route-mode="translate"
    >Translate
  </a>
</li>
@* Add the new modes here *@
```

### Adding the new Modes to our Index file

Open the `Views/Home/Index.cshtml` file, and add the new modes below the `@* Add the new mode titles below *@ comment

```html
@* Add the new mode titles below *@
else if (ViewBag.Mode == "movie"){
	<h1 class="display-4">Movie Recommendation</h1>
} 
else if (ViewBag.Mode == "summarize"){
	<h1 class="display-4">Summarizer</h1>
} 
else if (ViewBag.Mode == "translate"){
	<h1 class="display-4">Translator</h1>
}
```

Then we should add the language textbox used in the translator mode, this textbox should be added in the index file under the textarea, add the textbox under the `@* Add the language textbox below *@` comment

```html
else if (ViewBag.Mode == "translate") {
<input
  type="text"
  spellcheck="false"
  placeholder="Language"
  class="optional_input"
  id="toLang"
/>
}
```

Now inside the response box, we should add default text messages for each mode, add this code under the `@* Add Mode Responses below *@` comment

```html
else if (ViewBag.Mode == "movie") {
<div id="gpt_response">I can recommend movies based on what you like.</div>
} else if (ViewBag.Mode == "summarize") {
<div id="gpt_response">I can summarize long texts into small paragraphs.</div>
} else if (ViewBag.Mode == "translate") {
<div id="gpt_response">I will translate anything for you.</div>
}
```

Now scroll down to edit the JavaScript code in the SendPromptMain function, add this line of jquery code under the `// get 'toLang' value below` comment:

```js
// get 'toLang' value below
toLang = $("#toLang").val();
```

> Jquery is a JavaScript library that simplifies some of it's uses, like HTML document traversing, event handling and ajax interactions

We also need to add it in our `GPT_response` function in `GPT.cs` add `, string toLang = ""`

```c#
GPT_response(string prompt = "", string mode = "normal", string impersonator = "", string toLang = "", int nbImages = 1)
```

>Make sure you add it in the 4th parameter because the function is expecting to find it there

As well as in our `HomeControllers.cs` 

```c#
      public async Task<JsonResult> CallGPT(string prompt, string mode, string impersonator, string toLang, int nbImages)

        {

            var response = await GPT.GPT_response(prompt, mode, impersonator, toLang, nbImages);

            return Json(response);

        }
```

The last thing we have to edit in the `Index.cshtml` file is the ajax function that is sending the prompt and relating data to the controller, find the line that is sending the data (followed by the `// Add 'toLang' parameter in this line` comment) and add the toLang parameter in it:

```js
data: { prompt: prompt, mode: "@ViewBag.Mode", impersonator: impersonator, toLang: toLang, nbImages: nbImages }, // Add 'toLang' parameter in this line
```

> The data is being sent to the controller using ajax which is a technique used to send and receive data from a server asynchronously without reloading the web page

### Adding the prompt design in the 'GPT.cs' class

We added the look of the new modes and all we have to do now is add the prompt design in the GPT.cs class, navigate to the prompt design section and under the `// Add the prompt designs for the new modes here` comment add this code:

```c#
// Add the prompt designs for the new modes here
else if (mode == "movie")
{
	fullPrompt = "Act as a movie guide that only recommends movies and nothing else based on the user input, and respond to a person asking this: " + prompt + "?";
}
else if (mode == "translate")
{
    if (!String.IsNullOrEmpty(toLang))
    {
	    fullPrompt = "Act as a translator and translate " + prompt + " to " + toLang ;
    }
    else
    {
		fullPrompt = "Act as a translator and translate " + prompt + " to any language that you choose based on how good the sentence will sound and look";
    }
}
else if (mode == "summarize")
{
	fullPrompt = "Act as a summarizer and summarize the following: " + prompt + "";
} 
// keep the else block below, it is used for the image prompt
```

Finally, we are done with the new modes, run the solution again using `dotnet run` and test them.

>In case the previous solution was still running press `Ctrl+C` to stop it and then run it again after saving the changes you did.

---

## Adding the Image Generation Functionality

We have already added the structure for using the image generation model, the only thing we have to send an ImageCreateRequest if the mode is 'image'. In the `GPT.cs` class navigate to the `if (mode == "image")` block and add this code inside under the `// Add image creation request here` comment:

```c#
// Keep the else block below, it is used for the image prompt
else if (mode =="image")
	{
	if (nbImages < 1)
	{
	    nbImages = 1;
	}
	else if (nbImages > 5)
	{
	    nbImages = 5;
	}

	var imageRequest = new ImageGenerationRequest(
		prompt,
		numOfImages: nbImages,
		ImageSize._512
		);


	var imageResult = await api.ImageGenerations.CreateImageAsync(imageRequest);
	
	var images = "";
	
	foreach (var image in imageResult.Data){
		//Console.WriteLine(image.Url);
		images += image.Url + ", ";
	}
	return images;
}
//Chatgpt mode
```

> In the code above, we check if the user entered a large value for nbImages and limit it to 5 at most, because image generation costs higher than the other models.

The image generation mode should now be working, run the solution again using `dotnet run` to test it.

---

## ChatGPT API

ChatGPT uses a chat completion model called `ChatGPTTurbo_16k`, this model is much better than the other models and is 10 times cheaper, a great advantage of using it is that it can remember the previous messages in the conversation and shape it's responses according to the conversation

Let's try it out.

### What are conversations?

For the model to keep track of the conversation, we make a JSON list containing every message in the conversation and send it along with the request parameters.

Every time the user sends a prompt we append it to this conversation along with it's response, each message has a role.

These are the roles of messages:

1. System: the message with the role of system is the first message in the conversation and tells the AI how to behave during the conversation and what is it's purpose
2. User: these messages are the ones sent by the user
3. Assistant: these messages are the ones sent by the AI

### Creating our Conversation Class

1. Right-click on your Models folder > New file...
2. Name the file 'ChatConversation.cs'
3. Add the libraries first:

```c#
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Models;
```

We want to define the Class ChatConversation :

Initiate the class like this:
```c#
public class ChatConversation{

}
```

Next we add the key and create a chat Conversation Object:

```c#
public class ChatConversation
{
    private static OpenAIAPI api = new OpenAIAPI("<Add Key Here>");
    
    public Conversation chat;
    //Create ChatConversation here 
}

```

> Don't worry about the error under `chat` we will define it afterwards.
> A static class is a class that can only contain static members and cannot be instantiated.

Now we create the ChatConversation constructor:
```c#
//Create ChatConversation here
public ChatConversation()
    {
        chat = api.Chat.CreateConversation();
        chat.Model = Model.ChatGPTTurbo_16k;
        chat.RequestParameters.Temperature = 0.5;
        chat.AppendSystemMessage("You are a helpful assistant named ChatGPT");
    }
    //ConversationResponse method below
```

>**Model:** To choose which of the models we want to use.
>**Temperature:** As explained earlier to set the randomness of the model.
>**AppendSystemMessage:** To initialize and give the model it's first message.

Last thing we need to do in this class is to create the response method.
under `//ConversationResponse method below` add the following code:

```c#
	//ConversationResponse method below
    public async Task<string> ConversationResponse(string prompt)
    {
        chat.AppendUserInput(prompt);
        string response = await chat.GetResponseFromChatbotAsync();
        return response;
    }
```

>This method accepts a prompt as input and returns a Task representing the response. 
>It takes the input from the user `prompt` and then it asynchronously retrieves a response from the chatbot and assigns it to the **response** variable.

Now, to define it in our  `GPT.cs` class:
1. Open the `GPT.cs` class and at the top of the page add this instance of the chatConv
```c#
public class GPT
{
    public static ChatConversation chatConv = new ChatConversation(); //add this line before the GPT_response in the GPT Class
    public static async Task<string> GPT_response(string prompt = "", string mode = "normal", string impersonator = "", string toLang = "", int nbImages = 1)

    {
```

2. Scroll to the `// Chatgpt mode` comment and add this code after:

```c#
else if (mode == "chatgpt"){
	return await chatConv.ConversationResponse(prompt);
}
```

> We initialized a ChatConversation object as chatConv to generate the response.
> If the `mode` is set to `"chatgpt"`, this line calls the `ConversationResponse` method of the `chatConv` object, passing a prompt as input. It awaits the response asynchronously before returning it.
---
## Summary

Congrats, you can now use the OpenAI .Net Core SDK to build an AI website, build on that knowledge by experimenting in the code, adding new modes and ideas, and building creative solutions for a bigger project.
Thank you for attending this course and finishing the labs.
