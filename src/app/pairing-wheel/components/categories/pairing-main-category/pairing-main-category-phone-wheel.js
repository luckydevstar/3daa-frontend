import React from 'react';
import Konva from 'konva';

import CategoryBodyPlaceholder from 'images/icons/cheese.svg';

class PairingMainCategoryPhoneWheel extends React.Component {
  componentDidMount() {
    const { isSub, categories } = this.props;
    if (isSub) {
      this.initSubCanvas([]);
    } else {
      this.initCanvas(categories);
    }
  }
  componentDidUpdate(prevProps) {
    const { categories, subCategories, selectedSub } = this.props;
    if (prevProps.categories !== categories) {
      this.initCanvas(categories);
    }
    if (
      prevProps.subCategories !== subCategories ||
      prevProps.selectedSub !== selectedSub
    ) {
      if (!subCategories[selectedSub]) return;
      this.initSubCanvas(subCategories[selectedSub]);
    }
  }
  initCanvas(categories) {
    const { id, setSelectedSub } = this.props;
    const numWedges = categories.length;
    const angle = numWedges > 12 ? 360 / numWedges : 30;
    const stage = new Konva.Stage({
      container: id,
      width: 400,
      height: 400
    });
    const layer = new Konva.Layer();
    const wheel = new Konva.Group({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 180,
      fill: 'rgb(241, 242, 237)',
      shadowColor: 'gray',
      shadowBlur: 10,
      shadowOffset: 3,
      rotation: 90 - (angle - angle / 2)
    });
    const wheelCircle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 180,
      fill: 'rgb(241, 242, 237)',
      shadowColor: 'gray',
      shadowBlur: 10,
      shadowOffset: 3
    });
    wheel.add(wheelCircle);

    function addWedge(n, category) {
      const wedge = new Konva.Group({
        rotation: angle * n,
        opaicty: 0.2
      });

      const wedgeBackground = new Konva.Wedge({
        radius: 180,
        angle,
        fill: '#F1F2ED'
      });

      wedge.add(wedgeBackground);

      const text = new Konva.Text({
        text: category.title.toUpperCase(),
        fontFamily: 'Calibri',
        fontSize: 10,
        width: 50,
        align: 'center',
        fill: n === 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.4)',
        scaleX: n === 0 ? 1.1 : 0.8,
        scaleY: n === 0 ? 1.1 : 0.8,
        rotation: -75,
        x: 135,
        y: n === 0 ? 62 : 58
      });

      const line = new Konva.Line({
        x: 0,
        y: 0,
        points: [100, 0, 160, 0],
        stroke: '#D3D3D3',
        tension: 1
      });

      Konva.Image.fromURL(CategoryBodyPlaceholder, darthNode => {
        darthNode.setAttrs({
          x: 100,
          y: 40,
          width: 30,
          height: 30,
          rotation: -75
        });
        wedge.add(darthNode);
        layer.batchDraw();
      });

      wedge.add(text);
      wedge.add(line);
      text.cache();
      wedge.startRotation = wedge.rotation();
      wheel.add(wedge);
      wedge.on('click', function(e) {
        // const wedgeText = e.currentTarget.children[1];
        setSelectedSub(category.pairing_category_id);
        const rot = wedge.rotation();
        text.to({
          scaleX: 1.1,
          scaleY: 1.1,
          y: 62,
          fill: 'rgb(0, 0, 0)',
          duration: 0.2
        });
        wheel.to({
          rotation: 90 - (angle - angle / 2) - rot,
          duration: 0.2,
          easing: Konva.Easings.EaseInOut
        });
        for (let i = 1; i < wheel.children.length; i++) {
          const item = wheel.children[i].children[1];
          if (item._id === text._id) continue;
          item.to({
            fill: 'rgba(0, 0, 0, 0.3)',
            scaleX: 0.8,
            scaleY: 0.8,
            y: 58,
            duration: 0.2
          });
        }
      });
      wedge.on('mouseenter', () => {
        document.body.style.cursor = 'pointer';
      });
      wedge.on('mouseleave', () => {
        document.body.style.cursor = 'default';
      });
    }
    for (let n = 0; n < numWedges; n++) {
      addWedge(n, categories[n]);
    }
    layer.add(wheel);
    stage.add(layer);
  }
  initSubCanvas(categories) {
    const { id } = this.props;
    const numWedges = categories.length;
    const angle = numWedges > 12 ? 360 / numWedges : 30;
    const stage = new Konva.Stage({
      container: id,
      width: 550,
      height: 550
    });
    const layer = new Konva.Layer();
    const wheel = new Konva.Group({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 255,
      fill: 'rgb(241, 242, 237)',
      shadowColor: 'gray',
      shadowBlur: 10,
      shadowOffset: 3,
      rotation: 90 - (angle - angle / 2)
    });
    const wheelCircle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 255,
      fill: 'rgb(241, 242, 237)',
      shadowColor: 'gray',
      shadowBlur: 10,
      shadowOffset: 3
    });
    wheel.add(wheelCircle);

    function addWedge(n, category) {
      const wedge = new Konva.Group({
        rotation: angle * n
      });

      const wedgeBackground = new Konva.Wedge({
        radius: 255,
        angle,
        fill: '#F1F2ED'
      });

      wedge.add(wedgeBackground);

      const text = new Konva.Text({
        text: category.title.toUpperCase(),
        fontFamily: 'Calibri',
        fontSize: 10,
        fontStyle: 'bold',
        align: 'center',
        width: 90,
        fill: '#000000',
        rotation: -75,
        x: 210,
        y: 100,
        listening: false
      });

      const line = new Konva.Line({
        x: 0,
        y: 0,
        points: [150, 0, 245, 0],
        stroke: '#D3D3D3',
        tension: 1
      });

      wedge.add(text);
      wedge.add(line);
      text.cache();
      wedge.startRotation = wedge.rotation();
      wheel.add(wedge);
      wedge.on('click', () => {
        const rot = wedge.rotation();
        wheel.to({
          rotation: 90 - (angle - angle / 2) - rot,
          duration: 0.2,
          easing: Konva.Easings.EaseInOut
        });
      });
      wedge.on('mouseenter', e => {
        document.body.style.cursor = 'pointer';
      });
      wedge.on('mouseleave', () => {
        document.body.style.cursor = 'default';
      });
    }
    for (let n = 0; n < numWedges; n++) {
      addWedge(n, categories[n]);
    }
    layer.add(wheel);
    stage.add(layer);
  }
  render() {
    const { id } = this.props;
    return <div {...{ id }} />;
  }
}

export default PairingMainCategoryPhoneWheel;
