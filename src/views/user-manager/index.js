import util from '../../common/js/Utils/util'
import request from '../../common/js/Utils/request.js';

	export default {
		data() {
			return {
				filters: {
					account:"",
					name: ""
				},
				users: [],
				total: 0,
				pageNum : 1,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					name:[
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					sex: 0

				},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 0 ? '男' : row.sex == 1 ? '女' : '未知';
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
				this.filters.account = "";
				this.filters.name = "";
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				request("/user/queryForPage", {
					method: "POST",
					formatJSon: true,
					data: {
							"account": this.filters.account,
							"name": this.filters.name,
							"pageNum": this.pageNum,
							"pageSize": this.pageSize
						 }
				}).then((data) => {
					this.users = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;
				}).catch(() => {

				});

				this.listLoading = false;


			},
			//翻页
			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getUsers();
			},
			//改变pageSize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum <= lastPage){
					this.getUsers();
				}
			},
		
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					sex: 0,
					age: 0
				};
			},

			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							para.birthday = (!para.birthday || para.birthday == '') ? '' : util.formatDate.format(new Date(para.birthday), 'yyyy-MM-dd');
							request('/user', {
								method: "Post",
								data: para,
								formatJSon: true,
							}).then((data) => {
								if (data > 0){
									this.$message({type: 'success', message: "保存成功"})
								}
								this.getUsers();
							}).catch(
									
							)

							this.addFormVisible = false;
							this.addLoading = false
						});
					}
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birthday = (!para.birthday || para.birthday == '') ? '' : util.formatDate.format(new Date(para.birthday), 'yyyy-MM-dd');
							
							request("/user/" + para.id, {
								method: "PUT",
								data: para,
								formatJSon: true,
							}).then((data) => {
								if (data > 0){
									this.$message({type: 'success', message: "保存成功"})
								}
								this.getUsers();
							}).catch(
								  
							)
							this.editFormVisible = false;
							this.editLoading = false

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
					request("/user/" + para.id, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getUsers();
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
					request("/user/" + para.ids, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getUsers();
					}).catch()(

					)
					
				}).catch(() => {

				});

				this.listLoading = false;
			},

			//显示添加角色列表
			showRoleFrom: function (index, row) {
				//this.roleFormDate.roleFormVisible=false;
				//this.roleFormDate.roleFormVisible=!this.roleFormDate.roleFormVisible;
				
				this.$router.push({path:"/roleFrom",query:{id:row.id,account:row.account}});
			}
		},
		mounted() {
			this.getUsers();
		}
	}