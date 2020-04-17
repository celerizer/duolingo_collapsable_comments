/*
=============================================================================== 
  Constants
===============================================================================
*/

/* Classnames on the Duolingo forums */
const CLASS_MSG_BLOCK = "uMmEI";
const CLASS_MSG_REPLY = "uFNEM tCqcy";

/* Milliseconds to wait before extension is refreshed */
const UPDATE_INTERVAL = 2000;

/*
  Classes for each level of child heirarchy
  ---
  Duolingo supports up to 6 levels of nested comments. This is a lazy way of 
  identifying them and could instead be programatic.
*/
const CHILD_CLASSES = ["XXbxY", "_18pbo", "xte4h", "_2Grdu", "_1gpUN", "_2JM-K"];

var comments;

/*
=============================================================================== 
  Helpers
===============================================================================
*/

function countChildren(index)
{
  var count = 0;
  var baseLevel = comments[index].getAttribute("nestLevel");

  for (var i = index + 1; i < comments.length; i++)
  {
  	if (comments[i].getAttribute("nestLevel") > baseLevel)
  	  count++;
  	else
  	  break;
  }

  return count;
}

function nestLevel(element)
{
  return CHILD_CLASSES.indexOf(element.firstChild.className);
}

function updateComments()
{
  comments = document.body.getElementsByClassName(CLASS_MSG_BLOCK);
}

/*
=============================================================================== 
  Main logic
===============================================================================
*/

function install()
{
  updateComments();
  for (var i = comments.length - 1; i >= 0; i--)
  {
  	/* Everything's been installed here already */
  	if (comments[i].hasAttribute("index"))
  	  return;

    /* Add additional attributes */
  	comments[i].setAttribute("collapsed", false);
  	comments[i].setAttribute("index",     i);
  	comments[i].setAttribute("nestLevel", nestLevel(comments[i]));

  	/* Show number of children comments by reply button */
  	comments[i].getElementsByClassName(CLASS_MSG_REPLY)[0].textContent 
  	  += " (" + countChildren(i) + ")";

    /* Add event listeners */
    comments[i].addEventListener("mouseover",
      function(){ this.style.backgroundColor = "#EEE"; }, false);
    comments[i].addEventListener("mouseout", 
      function(){ this.style.backgroundColor = "#FFF"; }, false);
    comments[i].addEventListener("click",
      function(){ toggleChildren(this); }, false);
  }
}

function toggleChildren(element)
{
  var collapsed = element.getAttribute("collapsed") === "true";
  var index     = element.getAttribute("index");
  var baseLevel = element.getAttribute("nestLevel");

  updateComments();
  for (var i = +index + 1; i < comments.length; i++)
  {
    if (comments[i].getAttribute("nestLevel") > baseLevel)
    {
      if (collapsed)
        comments[i].style.display = "block";
      else
        comments[i].style.display = "none";
    }
    else
      break;
  }
  element.setAttribute("collapsed", !collapsed);
}

function extensionUpdate()
{
  install();
  setTimeout(function(){ extensionUpdate(); }, UPDATE_INTERVAL);
}

extensionUpdate();
