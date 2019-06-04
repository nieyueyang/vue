import util from '../../common/js/Utils/util'
import {axiosGet} from '../../utils/request.js';
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
				pageNum : 0,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
			//获取用户列表
			getRole() {
				this.listLoading = true;
				debugger
				request("/role/selectForPage", {
					method: "POST",
					formatJSon: true,
					data: {"roleCode": this.filters.roleCode,"roleName": this.filters.roleName,"pageNum": this.pageNum,"pageSize": this.pageSize}
				}).then((data) => {
					debugger
					this.role = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;
				}).catch(() => {

				});

				this.listLoading = false;
			},


					///分页    初始页currentPage、初始每页数据数pagesize
			handleSizeChange:function(pageSize,pageNum){
				debugger
				this.pageSize=pageSize;
				this.pageNum=pageNum;
				this.getRole();
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
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {};
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							axiosPost('/role', {
								data: para,
								formatJSon: true,
								headers: {
									'Content-Type':'application/json'
								}
							}).then((data) => {
								debugger
								this.getRole();
							}).catch(
								this.addLoading = false
								)

						});
					}
				});
			},
			selsChange: function (sels) {
				debugger
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