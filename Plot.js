class Plot {
    constructor(x,y,size,axisWeight,borderWeight,dataWeight,yBound,xBound,axisColor,borderColor,backgroundColor,dataColor,tickLength,tickSize
    ) {
        this.xData = x;
        this.yData = y;
        this.xData_px = x;
        this.yData_px = y;
        this.size = size;
        this.axisWeight = axisWeight;
        this.borderWeight = borderWeight;
        this.dataWeight = dataWeight;
        this.axisColor = axisColor;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.dataColor = dataColor;
        this.xBound = xBound;
        this.yBound = yBound;
        this.axisX;
        this.axisY;
        this.xTicks = [];
        this.yTicks = [];
        this.tickLength = tickLength;
        this.tickSize = tickSize;
        this.graph_HTML = "";

        // assign other properties (xData_px,yData_px,axisX,axisY)
        this.getAxisCoords();
        this.getXinPixel();
        this.getYinPixel();
        this.getTickPositions();

        // draw
        this.draw();
    }

    
    draw() {
        this.addBorder2SVG();
        this.addAxes2SVG();
        this.drawTicks();
        this.addData2SVG();
        this.finalizeSVG();
    }

    // fetch the pixel locations for the axis
    getAxisCoords() {
        this.axisX = widthToPx(0,this.xBound.min,this.xBound.max,this.size.width);
        this.axisY = heightToPx(0,this.yBound.min,this.yBound.max,this.size.height);
    }

    // convert x data values to their pixel values based on the defined bounds
    getXinPixel() {
        for (var i=0;i<this.xData.length;i++){
            this.xData_px[i] = widthToPx(this.xData[i],this.xBound.min,this.xBound.max,this.size.width);
        }
    }

    // converts y data values to their pixel values based on the defined bounds
    getYinPixel() {
        for (var i=0;i<this.yData.length;i++){
            this.yData_px[i] = heightToPx(this.yData[i],this.yBound.min,this.yBound.max,this.size.height);
        }
    }

    // add border to svg
    addBorder2SVG() {
        this.graph_HTML += 
        `<rect width="${this.size.width}" height="${this.size.height}" fill="${this.borderColor}"/>
        <rect x="${this.borderWeight}" y="${this.borderWeight}" width="${this.size.width-2*this.borderWeight}" height="${this.size.height-2*this.borderWeight}" fill="${this.backgroundColor}"" />\n`;
    }

    // add axes to svg
    addAxes2SVG() {
        this.graph_HTML +=
        `<line x1="${this.axisX}" y1="0" x2="${this.axisX}" y2="${this.size.height}" style="stroke:${this.axisColor};stroke-width:${this.axisWeight}"/>
        <line x1="0" y1="${this.axisY}" x2="${this.size.width}" y2="${this.axisY}" style="stroke:${this.axisColor};stroke-width:${this.axisWeight}" />\n`;
    }

    // add data to svg
    addData2SVG() {
        for (var i=1;i<this.xData.length;i++) {
            this.graph_HTML +=  `<line x1="${this.xData_px[i-1]}" y1="${this.yData_px[i-1]}" x2="${this.xData_px[i]}" y2="${this.yData_px[i]}" style="stroke:${this.dataColor};stroke-width:${this.dataWeight}" />\n`
        }
    }

    // format and append SVG to HTML
    finalizeSVG() {
        var img = document.createElement("svg");
        var base = document.getElementById("base");

        this.graph_HTML = 
        `<div>
            <svg width=${this.size.width} height=${this.size.height}>
                ${this.graph_HTML}
            </svg>
        </div>`;
        
        img.innerHTML = this.graph_HTML;
        base.appendChild(img);
    }

    getTickPositions() {
        // x-axis
        var px = 0;
        var dx = Math.floor(this.tickSize.x/(this.xBound.max-this.xBound.min)*this.size.width);
        // get positive ticks
        px = this.axisX + dx;
        while (px < this.size.width) {
            this.xTicks.push(px);
            px += dx;
        }
        px = this.axisX - dx;
        // get negative ticks
        while (px > 0) {
            this.xTicks.unshift(px);
            px -= dx;
        }

        // y-axis
        var dy = Math.floor(this.tickSize.y/(this.yBound.max-this.yBound.min)*this.size.height);
        // get positive ticks
        var px = this.axisY - dy;
        while (px > 0) {
            this.yTicks.push(px);
            px -= dy;
        }
        // get negative ticks
        px = this.axisY + dy;
        while (px < this.size.height) {
            this.yTicks.unshift(px);
            px += dy;
        }
    }

    drawTicks() {
        // draw x ticks
        for (var i=0; i<this.xTicks.length; i++) {
            this.drawTick(0,this.xTicks[i]);
        }
        // draw y ticks
        for (var i=0; i<this.yTicks.length; i++) {
            this.drawTick(1,this.yTicks[i]);
        }
    }

    drawTick(axis,px) {
        if (axis === 0) { // x-axis
            this.graph_HTML +=
            `<line x1="${px}" y1="${this.axisY}" x2="${px}" y2="${this.axisY - this.tickLength}" style="stroke:${this.axisColor};stroke-width:${this.axisWeight}"/>`
        } else if (axis === 1) { // y-axis
            this.graph_HTML +=
            `<line x1="${this.axisX}" y1="${px}" x2="${this.axisX+this.tickLength}" y2="${px}" style="stroke:${this.axisColor};stroke-width:${this.axisWeight}"/>`
        }
    }
}

        

function widthToPx (num,min,max,width) {
    var xRange = max - min;
    return x_px = Math.floor(width*(num/xRange-min/xRange));
};

function heightToPx (num,min,max,height) {
    var yRange = max - min;
    return y_px = Math.floor(height*(1-num/yRange+min/yRange));
};


function test() {
    let x = [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6];
    let y = [-1,-1,-2,-2,-3,-1,0,2,3,2,1,2,2.5];
    let width = 500;
    let height = 320;
    let size = {width,height};
    let axisWeight = 1.5;
    let borderWeight = 1.5;
    let dataWeight = 1.5;
    let yBound = {min:-3.2,max:3.2};
    let xBound = {min:-5.2,max:5.2};
    let borderColor = "#444444";
    let backgroundColor = "#ffffff";
    let axisColor = "rgb(25,25,25)";
    let dataColor = "rgb(0,180,180)";
    let tickLength = 6;
    let tickSize = {x:.5,y:.5};
    

    let myPlot = new Plot(x,y,size,axisWeight,borderWeight,dataWeight,yBound,
        xBound,axisColor,borderColor,backgroundColor,dataColor,tickLength,tickSize);
}

test();