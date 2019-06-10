import util from '../../common/js/Utils/util'
import request from '../../utils/request.js';

	export default {
		data() {
			return {
				filters: {
					roleCode: "",
					roleName:""
				},
				role: [],
				total: 0,
				pageNum : 1,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列

				
				addLoading: false,
				addFormVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
					roleCode: "",
					roleName:"",
					roleType: "0",
					isactive: "0",
				},

				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
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
					id: "",
					roleCode: "",
					roleName: "",
					roleType: "0",
					isactive: "0",
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
				if (date === undefined) {
				  return "";
				}
				//return util.formatDate.format(new Date(date), 'yyyy-MM-dd hh:mm:ss');
				return util.formatDate.format(new Date(date), 'yyyy-MM-dd');
			},

			clear(){
				this.filters.roleCode = "";
				this.filters.roleName = "";
			},
			//获取用户列表
			getRole() {
				this.listLoading = true;
				request("/role/selectForPage", {
					method: "POST",
					formatJSon: true,
					data: {
							"roleCode": this.filters.roleCode,
							"roleName": this.filters.roleName,
							"pageNum": this.pageNum,
							"pageSize": this.pageSize
						 }
				}).then((data) => {
					this.role = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;
				}).catch(() => {

				});

				this.listLoading = false;
			},


			//分页    初始页currentPage、初始每页数据数pagesize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum < lastPage){
					this.getRole();
				}
			},
			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getRole();
			},	
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRole();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				debugger
				this.editFormVisible = true;
				this.editForm = row;
				//this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {roleType : 0,isactive : 0};
			},

			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							request('/role', {
								method: "Post",
								data: para,
								formatJSon: true,
							}).then((data) => {
								if (data > 0){
									this.$message({type: 'success', message: "保存成功"})
								}
								this.getRole();
							}).catch(
								  
							)

							this.addFormVisible = false;
							this.addLoading = false
						});
					}
				});
			},

			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getRole();
							});
						});
					}
				});
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRole();
					});
				}).catch(() => {

				});
			}
		},
		
		mounted() {
			this.getRole();
		}
	}