require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import * as ReactDOM from 'react/lib/ReactDOM';


// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数, 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
    for (var i = 0; i < imageDataArr.length; i++) {
        var singleImageData = imageDataArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDataArr[i] = singleImageData;
    }

    return imageDataArr;
})(imageDatas);

var ImaFigure = React.createClass({
  render: function () {
    var styleObj = {};

    if (this.props.arrange) {
      styleObj = this.props.arrange.pos;
    }

      return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
});

function  getRandom(low, high) {
  return Math.ceil(Math.random() * (high - low));
}

var AppComponent = React.createClass({
  Constant : {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },

  render() {
    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          left: '0',
          top: '0'
        }
      }
      imgFigures.push(<ImaFigure data={value}
                                 ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  },

  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x;

      // 设置居中centerIndex的图片
      var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
      imgsArrangeCenterArr[0].pos = centerPos;

      // 设置上部区域的图片
      var topImgNum = 1, // 取0或者一张图片
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum)),
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

      imgsArrangeTopArr.forEach(function (value, index) {
          imgsArrangeTopArr[index].pos = {
            left: getRandom(vPosRangeX[0], vPosRangeX[1]),
            top: getRandom(vPosRangeTopY[0], vPosRangeTopY[1])
          }
      });

      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
      console.log(imgsArrangeArr);
  },

  getInitialState() {
    return {
      imgsArrangeArr: [
      ]
    }
  },

  // 组件加载后,为每张图片计算其位置
  componentDidMount() {

    // 拿到舞台的大小

    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左侧,右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = - halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(3);
  }
});

export default AppComponent;
