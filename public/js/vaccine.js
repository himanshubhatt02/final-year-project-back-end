
new Vue({
    el: '#app',
    data: {
      selected: '',
      r: [
        {
          id: 1,
          name: 'COMP',
          color: '#00FF00'
        },
        {
          id: 2,
          name: 'PNDG',
          color: '	#FFFF00'
        },
        {
          id: 3,
          name: 'OVDUE',
          color: '#f00'
        }
      ]
    },
    computed: {
      selectedColor() {
        let color = '#fff';
        
        const data = this.r.find(data => data.id === this.selected);
        
        if (data) {
          color = data.color;
        }
        
        return color;
      }
    }
  })
  