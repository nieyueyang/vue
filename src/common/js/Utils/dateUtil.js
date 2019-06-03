export default {
   
    methods: {
        //日期格式化
        dateFormat: function(row, column){
            var date = row[column.property];
            if (date === undefined) {
              return "";
            }
            //return util.formatDate.format(new Date(date), 'yyyy-MM-dd hh:mm:ss');
            return util.formatDate.format(new Date(date), 'yyyy-MM-dd');
        }

    }

}