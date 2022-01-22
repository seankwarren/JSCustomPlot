function test() {
    let x = [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6];
    let y = [-1,-1,-2,-2,-3,-1,0,2,3,2,1,2,2.5];
    let width = 500;
    let height = 320;
    let size = {width,height};
    let axisWeight = 1;
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
    let labelSize = 10;
    

    let myPlot = new Plot(
        x,y,size,axisWeight,borderWeight,dataWeight,yBound,
        xBound,axisColor,borderColor,backgroundColor,dataColor,
        tickLength,tickSize,labelSize
        );
}

test();