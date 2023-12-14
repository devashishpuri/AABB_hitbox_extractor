
$(function () {

    // get references to the canvas and context
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var img = document.getElementById("base-image");
    var image = new Image();

    // style the context
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;

    // calculate where the canvas is on the window
    // (used to help calculate mouseX/mouseY)
    var $canvas = $("#canvas");
    var canvasOffset = $canvas.offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();

    var result = '';

    // this flage is true when the user is dragging the mouse
    var isDown = false;

    // these vars will hold the starting mouse position
    var startX;
    var startY;

    // Adjusted Image Dimentions
    var adjustedWidth;
    var adjustedHeight;

    // Hit Box Dimentions
    var rectTop;
    var rectLeft;
    var rectWidth;
    var rectHeight;


    function handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        // save the starting x/y of the rectangle
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);

        // set a flag indicating the drag has begun
        isDown = true;
    }

    function handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the dragging flag
        isDown = false;
    }

    function handleMouseOut(e) {
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the dragging flag
        isDown = false;
    }

    function handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        // if we're not dragging, just return
        if (!isDown) { return; }

        // get the current mouse position
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // Put your mousemove stuff here

        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // calculate the rectangle width/height based
        // on starting vs current mouse position
        var width = mouseX - startX;
        var height = mouseY - startY;

        // draw a new rect from the start position 
        // to the current mouse position
        ctx.strokeRect(startX, startY, width, height);

        rectLeft = startX;
        rectTop = startY;
        rectWidth = width;
        rectHeight = height;

        setResult();
    }

    function renderImage(e) {
        var files = e.target.files;
        var file = files[0];
        var reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                reset();

                img.src = evt.target.result;
                image.src = evt.target.result;

                image.onload = function () {
                    setResult();
                }
            }
        }
    }

    function setResult() {
        const dimention = 420;
        result = '';

        if (image.src) {
            result += `Image Dimentions: w: ${image.width} h: ${image.height}\n`;

            if (image.height > image.width) {
                adjustedHeight = dimention;
                adjustedWidth = Math.round((image.width / image.height) * dimention);
            } else if (image.width >= image.height) {
                adjustedWidth = dimention;
                adjustedHeight = Math.round((image.height / image.width) * dimention);
            }
            result += ` Adjusted Dimentions: w: ${adjustedWidth} h: ${adjustedHeight}\n`;
        }

        if (rectLeft) {
            result += ` Rect: l: ${rectLeft} t: ${rectTop} w: ${rectWidth} h: ${rectHeight}`;

            // Adjusted Rect relative to Adjusted Dimentions
            var adjustedLeft = (rectLeft / adjustedWidth).toFixed(3);
            var adjustedTop = (rectTop / adjustedHeight).toFixed(3);
            var adjustedRectWidth = (rectWidth / adjustedWidth).toFixed(3);
            var adjustedRectHeight = (rectHeight / adjustedHeight).toFixed(3);
            result += ` Rect: l: ${adjustedLeft}% t: ${adjustedTop}% w: ${adjustedRectWidth}% h: ${adjustedRectHeight}%`;
        }

        document.getElementById("result").innerText = result;
    }

    function reset() {
        rectLeft = null;
        rectTop = null;
        rectWidth = null;
        rectHeight = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setResult();
    }

    // listen for mouse events
    $("#canvas").mousedown(handleMouseDown);
    $("#canvas").mousemove(handleMouseMove);
    $("#canvas").mouseup(handleMouseUp);
    $("#canvas").mouseout(handleMouseOut);

    $("#image-picker").change(renderImage);

    $('#reset').click(reset);

}); // end $(function(){});
