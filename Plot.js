class Plot {
    constructor(x,y,size,axisWeight,borderWeight,dataWeight,yBound,xBound,axisColor,borderColor,backgroundColor,dataColor,tickLength,tickSize, labelSize
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
        this.tickLabels = {x:[],y:[]};
        this.labelSize = labelSize;
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
        var x = this.xData;
        for (var i=0;i<x.length;i++){
            // ****  CANT FIGURE OUT how to dereference xData_px from xData *****
            this.xData_px[i] = widthToPx(x[i],this.xBound.min,this.xBound.max,this.size.width);
            this.xData[i] = x[i];
        }
    }

    // converts y data values to their pixel values based on the defined bounds
    getYinPixel() {
        var y = this.yData;
        for (var i=0;i<y.length;i++){
            // ****  CANT FIGURE OUT how to dereference yData_px from yData *****
            this.yData_px[i] = heightToPx(y[i],this.yBound.min,this.yBound.max,this.size.height);
            this.yData[i] = y[i];
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

    // add axis ticks to svg
    drawTicks() {

        // draw x ticks
        for (var i=0; i<this.xTicks.length; i++) {
            this.addTick2SVG(0,this.xTicks[i]);
            this.addTickLabel2SVG(0,this.xTicks[i],i); // label

        }

        // draw y ticks
        for (var i=0; i<this.yTicks.length; i++) {
            this.addTick2SVG(1,this.yTicks[i]);
            this.addTickLabel2SVG(1,this.yTicks[i],i); // label
        }
    }

    // add data to svg
    addData2SVG() {
        // **** Midway through converting to using path instead of lines
        var pathString = "M " + (this.xData_px[0]) + " " + (this.yData_px[0]) + " ";
        for (var i=0;i<this.xData.length;i++) {
            pathString += ("L " + (this.xData_px[i])+ " " + (this.yData_px[i]) + " ");
        }
        this.graph_HTML += `<path d="${pathString}" stroke="${this.dataColor}" stroke-width="${this.dataWeight}" fill="transparent"/>\n`
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
        var tx = 0;
        var deltaX= Math.floor(this.tickSize.x/(this.xBound.max-this.xBound.min)*this.size.width);
        
        // get zero location
        this.xTicks.push(this.axisX);
        this.tickLabels.x.push(0);

        // get positive ticks px positions
        px = this.axisX + deltaX;
        tx = this.tickSize.x
        while (px < this.size.width) {
            this.xTicks.push(px);
            this.tickLabels.x.push(tx);
            px += deltaX;
            tx += this.tickSize.x;
        }
        px = this.axisX - deltaX;
        tx = -this.tickSize.x;

        // get negative ticks px positions
        while (px > 0) {
            this.xTicks.unshift(px);
            this.tickLabels.x.unshift(tx);
            px -= deltaX;
            tx -= this.tickSize.x;
        }

        // y-axis
        var dy = Math.floor(this.tickSize.y/(this.yBound.max-this.yBound.min)*this.size.height);
        // get zero position
        this.yTicks.push(this.axisY);
        this.tickLabels.y.push(0);

        // get positive tick px positions
        px = this.axisY - dy;
        tx = this.tickSize.y;
        while (px > 0) {
            this.yTicks.push(px);
            this.tickLabels.y.push(tx)
            px -= dy;
            tx += this.tickSize.y;
        }
        
        // get negative ticks px positions
        px = this.axisY + dy;
        tx = -this.tickSize.y
        while (px < this.size.height) {
            this.yTicks.unshift(px);
            this.tickLabels.y.unshift(tx);
            px += dy;
            tx -= this.tickSize.y;
        }
    }

    addTick2SVG(axis,px) {
        if (axis === 0) { // x-axis
            this.graph_HTML +=
            `<line class="tick-marker" x1="${px}" y1="${this.axisY}" x2="${px}" y2="${this.axisY - this.tickLength}" style="stroke:${this.axisColor};stroke-width:${this.axisWeight}"/>`
        } else if (axis === 1) { // y-axis
            this.graph_HTML +=
            `<line class="tick-marker" x1="${this.axisX}" y1="${px}" x2="${this.axisX+this.tickLength}" y2="${px}" style="stroke:${this.axisColor};stroke-width:${this.axisWeight}"/>`
        }
    }

    addTickLabel2SVG(axis,px,i) {
        //console.log(axis);
        var adjZero = 0;
        if (axis === 0) { // x-axis
            if (this.tickLabels.x[i] === 0) adjZero = 0.7*this.labelSize;
            this.graph_HTML +=
            `<text class="tick-label" x="${px-adjZero}" 
            y="${this.axisY+this.labelSize+this.axisWeight}" font-size="${this.labelSize}px" 
            fill="${this.axisColor}" text-anchor="middle" font-weight="bold">${this.tickLabels.x[i]}</text>\n`;
        }
        if (axis === 1 && this.tickLabels.y[i] != 0) { // y-axis
            this.graph_HTML +=
            `<text class="tick-label" x="${this.axisX-2*this.axisWeight}" 
            y="${px+this.labelSize/2-2*this.axisWeight}" font-size="${this.labelSize}px" 
            fill="${this.axisColor}" text-anchor="end" font-weight="bold">${this.tickLabels.y[i]}</text>\n`;
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


