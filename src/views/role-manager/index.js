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
					roleCode: [
						{ required: true, message: '请输入角色编码', trigger: 'blur' }
					],
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					]
				},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roleCode: [
						{ required: true, message: '请输入角色编码', trigger: 'blur' }
					],
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
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
			//角色类别
			formatRoleType: function (row, column) {
				return row.roleType == "0" ? "业务类" :row.roleType == "1" ? "管理类" : row.roleType == "2" ? "审计类" : '未知';
			},
			//是否启用
			formatIsactive: function (row, column) {
				return row.isactive == "0" ? "启用" :row.isactive == "1" ? "停用" : "未知";
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
				this.filters.roleCode = "";
				this.filters.roleName = "";
			},
			//获取角色列表
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

			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getRole();
			},	
			//改变pageSize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum <= lastPage){
					this.getRole();
				}
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = row;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							request("/role/" + para.id, {
								method: "PUT",
								data: para,
								formatJSon: true,
							}).then((data) => {
								if (data > 0){
									this.$message({type: 'success', message: "保存成功"})
								}
								this.getUser();
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
					request("/role/" + para.id, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getRole();
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
					request("/role/" + para.ids, {
						method: "DELETE",
						formatJSon: true,
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getRole();
					}).catch()(

					)
					
				}).catch(() => {

				});
			}
		},
		
		mounted() {
			this.getRole();
		}
	}