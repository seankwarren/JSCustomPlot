function Plot(
    x,
    y,
    size =          {width:300,height:200},
    axisWeight =    1,
    borderWeight =  1,
    dataWeight =    1,
    yBound =        {min:-0.5,max:3.5},
    xBound =        {min:-0.5,max:5.5}
) {
    this.xData = x;
    this.yData = y;
    this.xData_px = x;
    this.yData_px = y;
    this.size = size;
    this.axisWeight = axisWeight;
    this.borderWeight = borderWeight;
    this.dataWeight = dataWeight;
    this.xBound = xBound;
    this.yBound = yBound;

    let canvas = document.createElement("CANVAS");
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    
    this.drawPlot = function () {
        this.setFigureSize();
        this.getAxisCoords();
        this.drawAxes(x=this.axisX,y=this.axisY,weight=this.axisWeight);
        this.drawBorder(weight=this.borderWeight);
        this.addToHTMLBody(this.canvas);
        this.getXinPixel();
        this.getYinPixel();
        this.drawData(weight=this.dataWeight);
    };

    this.drawBorder = function (weight) {
        this.ctx.strokeStyle = "#5b5b5b";
        this.ctx.lineWidth = weight;
        this.ctx.strokeRect(weight/2, weight/2, this.size.width-weight, this.size.height-weight);
    };

    this.drawAxes = function (x,y,weight) {
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = weight;
        this.drawXAxis(y,weight);
        this.drawYAxis(x,weight);
    };
    
    this.drawXAxis = function (y,weight) {
        this.ctx.beginPath();
        this.ctx.moveTo(0+(weight/2), y+(weight/2));
        this.ctx.lineTo(this.size.width+(weight/2), y+(weight/2));
        this.ctx.stroke();
    };

    this.drawYAxis = function (x,weight) {
        this.ctx.beginPath();
        this.ctx.moveTo(x+(weight/2), 0+(weight/2));
        this.ctx.lineTo(x+(weight/2), this.size.height)+(weight/2);
        this.ctx.stroke();
    };
    
    this.drawData = function (weight) {
        this.ctx.strokeStyle = "#990000";
        this.ctx.lineWidth = weight;
        this.ctx.beginPath();
        this.ctx.moveTo(this.xData_px[0], this.yData_px[0]);
        for (var i=1;i<this.xData.length;i++){
            this.ctx.lineTo(this.xData_px[i], this.yData_px[i]);
        }
        this.ctx.stroke();
    };

    this.getAxisCoords = function () {
        this.axisX = widthToPx(0,this.xBound.min,this.xBound.max,this.size.width);
        this.axisY = heightToPx(0,this.yBound.min,this.yBound.max,this.size.height);
    };

    this.getXinPixel = function () {
        for (var i=0;i<this.xData.length;i++){
            this.xData_px[i] = widthToPx(this.xData[i],this.xBound.min,this.xBound.max,this.size.width);
        }
    };

    this.getYinPixel = function () {
        for (var i=0;i<this.yData.length;i++){
            this.yData_px[i] = heightToPx(this.yData[i],this.yBound.min,this.yBound.max,this.size.height);
        }
    };

    this.setFigureSize = function () {
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
    };
    
    this.addToHTMLBody = function () {
        document.body.appendChild(this.canvas);
    };

}

function widthToPx (num,min,max,width) {
    var xRange = max - min;
    return x_px = Math.floor(width*(num/xRange-min/xRange));
};

function heightToPx (num,min,max,height) {
    var yRange = max - min;
    return y_px = Math.floor(height*(1-num/yRange+min/yRange));
};


const myPlot = new Plot(
    x = [0,1,2,3,4,5],
    y = [0,2,3,2,1,2],
    size = {width:500,height:350},
    axisWeight = 2,
    borderWeight = 2,
    dataWeight = 2,
    yBound = {min:-0.2,max:3.2},
    xBound = {min:-0.2,max:5.2}
);
myPlot.drawPlot();