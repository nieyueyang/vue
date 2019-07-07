import util from '../../common/js/Utils/util'
import request from '../../common/js/Utils/request.js';

	export default {
		data() {
			return {
				query: {
					groupCode:"",
					groupName :""
				},
				funcGroup: [],
				appSystemFunc:[],
				total: 0,
				pageNum : 1,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列

				openLoading: false,
				openFormVisible: false,//新增界面是否显示
				//新增界面数据
				openForm: {

				},
				openFormRules: {
					groupCode: [
						{ required: true, message: "请输入功能组编码", trigger: 'blur' }
					],
					groupName: [
						{ required: true, message: "请输入功能组名称", trigger: 'blur' }
					]
				},
				funcForm: {

				},
			}
		},

		methods: {
			//日期格式化
			dateFormat: function(row, column){
				var date = row[column.property];
				if (date == undefined || date == "" || date == null) {
				  return "";
				}
				return util.formatDate.format(new Date(date), 'yyyy-MM-dd');
			},

			clear(){
				this.query.groupCode = "";
				this.query.groupName = "";
			},
			//获取功能列表
			getFuncGroup() {
				this.listLoading = true;
				request("/funcgroup/" + this.pageNum + "/" + this.pageSize, {
					method: "GET",
					//formatJSon: true,
					param: {
							"groupCode": this.query.groupCode,
							"groupName": this.query.groupName
						 }
				}).then((data) => {
					this.funcGroup = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;
				}).catch(() => {

				});

				this.listLoading = false;
			},

			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getFuncGroup();
			},	
			//改变pageSize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum <= lastPage){
					this.getFuncGroup();
				}
			},
			//显示新增界面
			handleAdd: function () {
				this.openFormVisible = true;
				this.openForm = {};
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.openFormVisible = true;
				this.openForm = row;
			},
			save:function(){
				this.$refs.openForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.openLoading = true;
							let para = Object.assign({}, this.openForm);
							debugger
							if (para.id == "" || para.id ==null || para.id =="undefined"  ){
								//新增
								request('/funcgroup', {
									method: "Post",
									data: para,
									formatJSon: true,
								}).then((data) => {
									if (data > 0){
										this.$message({type: 'success', message: "保存成功"})
									}
									this.getFuncGroup();
								}).catch(
										
								)
							}else{
								//编辑
								request("/funcgroup/" + para.id, {
									method: "PUT",
									data: para,
									formatJSon: true,
								}).then((data) => {
									if (data > 0){
										this.$message({type: 'success', message: "保存成功"})
									}
									this.getFuncGroup();
								}).catch(
										
								)
							}
							this.openFormVisible = false;
							this.openLoading = false
						});
					}
				});
			},
			//删除
			handleDelete: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					request("/funcgroup/" + para.id, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getFuncGroup();
					}).catch()(

					)

				}).catch(() => {

				});

				this.listLoading = false;
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchDelete: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
					request("/funcgroup/" + para.ids, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getFuncGroup();
					}).catch()(

					)
					
				}).catch(() => {

				});
			},
			expandChange:function(row,status){
				if(status){
					request("/systemFunc" + "/" + row.id, {
						method: "GET",
					}).then((data) => {
						this.appSystemFunc = data;
					}).catch(
							
					)
				}

			}
			  
		},
		
		mounted() {
			this.getFuncGroup();
		}
	}