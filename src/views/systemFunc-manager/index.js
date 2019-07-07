import util from '../../common/js/Utils/util'
import request from '../../common/js/Utils/request.js';

	export default {
		data() {
			return {
				query: {
					funcCode:"",
					funcName:"",
					systemCode: ""
				},
				appSystemFunc: [],
				total: 0,
				pageNum : 1,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列
				currentRow: null, //当前选中列
				appSystem:[],
				value: '',

				openLoading: false,
				openFormVisible: false,//新增界面是否显示
				//新增界面数据
				openForm: {

				},
				openFormRules: {
					funcCode: [
						{ required: true, message: "请输入功能编码", trigger: 'blur' }
					],
					funcName: [
						{ required: true, message: "请输入功能名称", trigger: 'blur' }
					],
					// systemCode: [
					// 	{ required: true, message: "请输入系统编码", trigger: 'blur' }
					// ],
					// type: [
					// 	{ required: true, message: "请选择权限类型", trigger: 'blur' }
					// ],
					// isLeaf: [
					// 	{ required: true, message: "请选择是否叶子节点", trigger: 'blur' }
					// ],
					// openType: [
					// 	{ required: true, message: "请选择打开方式", trigger: 'blur' }
					// ],

				},

				
			}
		},

		methods: {
			//类别显示转换
			formatType: function (row, column) {
				return row.type == "0" ? "菜单" : row.type == "1" ? "功能" : "";
			},
			//启用停用显示转换
			formatStatus: function (row, column) {
				return row.status == "0" ? "启用" : row.status == "1" ? "禁用" : "";
			},
			//打开方式转换
			formatopenType: function (row, column) {
				return row.openType == "0" ? "内嵌" : row.openType == "1" ? "弹出" : "";
			},
			//日期格式化
			dateFormat: function(row, column){
				var date = row[column.property];
				if (date == undefined || date == "" || date == null) {
				  return "";
				}
				//return util.formatDate.format(new Date(date), 'yyyy-MM-dd hh:mm:ss');
				return util.formatDate.format(new Date(date), 'yyyy-MM-dd');
			},

			clear(){
				this.query.funcCode = "";
				this.query.funcName = "";
				this.query.systemCode = "";
			},
			//获取功能列表
			getAppSystemFunc() {
				this.listLoading = true;
				request("/systemFunc/" + this.pageNum + "/" + this.pageSize, {
					method: "GET",
					//formatJSon: true,
					param: {
							"funcCode": this.query.funcCode,
							"funcName": this.query.funcName,
							"systemCode": this.query.systemCode
						 }
				}).then((data) => {
					this.appSystemFunc = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;
				}).catch(() => {

				});

				this.listLoading = false;
			},

			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getAppSystemFunc();
			},	
			//改变pageSize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum <= lastPage){
					this.getAppSystemFunc();
				}
			},
			//显示新增界面
			handleAdd: function () {
				this.getAppSystem();
				this.openFormVisible = true;
				this.openForm = {status: "0",type: "0",openType:"0"};
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.openFormVisible = true;
				this.openForm = row;
			},
			getAppSystem:function(){
				//查询注册系统
				request('/appsystem', {
					method: "GET",
					formatJSon: true,
				}).then((data) => {
					this.appSystem = data;
				}).catch(
						
				)

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
								request('/systemFunc', {
									method: "Post",
									data: para,
									formatJSon: true,
								}).then((data) => {
									if (data > 0){
										this.$message({type: 'success', message: "保存成功"})
									}
									this.getAppSystemFunc();
								}).catch(
										
								)
							}else{
								//编辑
								request("/systemFunc/" + para.id, {
									method: "PUT",
									data: para,
									formatJSon: true,
								}).then((data) => {
									if (data > 0){
										this.$message({type: 'success', message: "保存成功"})
									}
									this.getAppSystemFunc();
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
					request("/systemFunc/" + para.id, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getAppSystemFunc();
					}).catch()(

					)

				}).catch(() => {

				});

				this.listLoading = false;
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			CurrentRowChange:function(row){
				this.currentRow = row;
			},
			//批量删除
			batchDelete: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
					request("/systemFunc/" + para.ids, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getAppSystemFunc();
					}).catch()(

					)
					
				}).catch(() => {

				});
			}

		},
		
		mounted() {
			this.getAppSystemFunc();
		}
	}