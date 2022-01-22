class Plot {
    constructor(x,y,size,axisWeight,borderWeight,dataWeight,yBound,xBound,axisColor,borderColor,backgroundColor,dataColor
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
        this.graph_HTML = "";
  

        // assign other properties (xData_px,yData_px,axisX,axisY)
        this.getAxisCoords();
        this.getXinPixel();
        this.getYinPixel();

        // draw
        this.draw();
    }

    
    draw() {
        this.addBorder2SVG();
        this.addAxes2SVG();
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
    let x = [0,1,2,3,4,5];
    let y = [0,2,3,2,1,2];
    let width = 500;
    let height = 320;
    let size = {width,height};
    let axisWeight = 1.2;
    let borderWeight = 1.2;
    let dataWeight = 1.2;
    let yBound = {min:-1,max:3.2};
    let xBound = {min:-1,max:8};
    let borderColor = "#444444";
    let backgroundColor = "#ffffff";
    let axisColor = "rgb(25,25,25)";
    let dataColor = "rgb(0,180,180)";

    let myPlot = new Plot(x,y,size,axisWeight,borderWeight,dataWeight,yBound,
        xBound,axisColor,borderColor,backgroundColor,dataColor);
}

test();