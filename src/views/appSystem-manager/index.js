import util from '../../common/js/Utils/util'
import request from '../../utils/request.js';

	export default {
		data() {
			return {
				filters: {
					systemCode: "",
					systemName:""
				},
				appSystem: [],
				total: 0,
				pageNum : 1,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列

				addLoading: false,
				addFormVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {

				},
				addFormRules: {
					systemCode: [
						{ required: true, message: '请输入系统编码', trigger: 'blur' }
					],
					systemName: [
						{ required: true, message: '请输系统名称', trigger: 'blur' }
					],
					domain: [
						{ required: true, message: '请输域名', trigger: 'blur' }
					]
				},

				

	

			}
		},

		methods: {
			//类别显示转换
			formatType: function (row, column) {
				return row.type == "0" ? "内部" : row.type == "1" ? "外部" : "";
			},
			//启用停用显示转换
			formatStatus: function (row, column) {
				return row.status == "0" ? "启用" : row.status == "1" ? "禁用" : "";
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
				this.filters.systemCode = "";
				this.filters.systemName = "";
			},
			//获取角色列表
			getAppSystem() {
				this.listLoading = true;
				request("/appsystem/queryForPage", {
					method: "POST",
					formatJSon: true,
					data: {
							"systemCode": this.filters.systemCode,
							"systemName": this.filters.systemName,
							"pageNum": this.pageNum,
							"pageSize": this.pageSize
						 }
				}).then((data) => {
					this.appSystem = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;
				}).catch(() => {

				});

				this.listLoading = false;
			},

			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getAppSystem();
			},	
			//改变pageSize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum <= lastPage){
					this.getAppSystem();
				}
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {};
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.addFormVisible = true;
				this.addForm = row;
			},
			save:function(){
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							debugger
							if (para.id == "" || para.id ==null || para.id =="undefined"  ){
								//新增
								request('/appsystem', {
									method: "Post",
									data: para,
									formatJSon: true,
								}).then((data) => {
									if (data > 0){
										this.$message({type: 'success', message: "保存成功"})
									}
									this.getAppSystem();
								}).catch(
										
								)
							}else{
								//编辑
								request("/appsystem/" + para.id, {
									method: "PUT",
									data: para,
									formatJSon: true,
								}).then((data) => {
									if (data > 0){
										this.$message({type: 'success', message: "保存成功"})
									}
									this.getAppSystem();
								}).catch(
										
								)
							}
							this.addFormVisible = false;
							this.addLoading = false
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
					request("/appsystem/" + para.id, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getAppSystem();
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
					request("/appsystem/" + para.ids, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getAppSystem();
					}).catch()(

					)
					
				}).catch(() => {

				});
			}

		},
		
		mounted() {
			this.getAppSystem();
		}
	}