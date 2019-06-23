import util from '../../common/js/Utils/util'
import request from '../../utils/request.js';

	export default {
		data() {
			return {
				filters: {
					roleCode: "",
					roleName:""
				},
				userRole: [],
				total: 0,
				pageNum : 1,
				pageSize: 10, 
				listLoading: false,
				sels: [],//列表选中列

				addRoleVisible: false,
				addRoleFrom:[],

				roleFrom:{
					roleCode: "",
					roleName: "",
					role: [],
					total: 0,
					pageNum : 1,
					pageSize: 10, 
					sels: []//列表选中列
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
			getUserRole() {
				let id = this.$route.query.id;
				this.listLoading = true;
				request("/userrole/" + id + "/" +this.pageNum + "/"+ this.pageSize + "/0" , {
					method: "GET",
					param: {
						roleCode:this.filters.roleCode,
						roleName:this.filters.roleName,
					}

				}).then((data) => {
					this.userRole = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;

					// this.$nextTick(function() {
					// 	this.toggleSelection(this.userRole,id,account);
					//   })

				}).catch(() => {

				});

				this.listLoading = false;
			},
			//默认选中
			toggleSelection(userRole,id,account) {
				if (userRole) {
					userRole.forEach(row => {
					row.userId = id;
					row.userAccount = account;
					if(row.isDelete == ""){
						row.isDelete="0";
					}
					if(row.id != "" && row.isDelete != "1"){
						this.$refs.multipleTable.toggleRowSelection(row, true);
					}

				  })
				} else {
				  this.$refs.multipleTable.clearSelection()
				}
			  },

			handleCurrentChange:function(pageNum){
				this.pageNum=pageNum;
				this.getUserRole();
			},	
			//改变pageSize
			handleSizeChange:function(pageSize){
				this.pageSize=pageSize;
				let lastPage = Math.ceil(this.total / pageSize);
				if (this.pageNum <= lastPage){
					this.getUserRole();
				}
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//获取角色列表
			getRole() {
				let id = this.$route.query.id;
				this.listLoading = true;
				request("/userrole/" + id + "/" +this.roleFrom.pageNum + "/"+ this.roleFrom.pageSize + "/1" , {
					method: "GET",
					param: {
						roleCode:this.roleFrom.roleCode,
						roleName:this.roleFrom.roleName,
					  }

				}).then((data) => {
					this.roleFrom.role = data.list;
					this.roleFrom.total = data.total;
					this.roleFrom.pageNum = data.pageNum;
					this.roleFrom.pageSize = data.pageSize;
					this.roleFrom.role.forEach(row =>{
						row.userId = this.$route.query.id;
						row.userAccount = this.$route.query.account;
					})
				}).catch(() => {

				});

				this.listLoading = false;
			},

			handleCurrentChange_role:function(pageNum){
				this.roleFrom.pageNum=pageNum;
				this.getRole();
			},	
			//改变pageSize
			handleSizeChange_role:function(pageSize){
				this.roleFrom.pageSize=pageSize;
				let lastPage = Math.ceil(this.roleFrom.total / pageSize);
				if (this.roleFrom.pageNum <= lastPage){
					this.getRole();
				}
			},

			clearRole(){
				this.roleFrom.roleCode = "";
				this.roleFrom.roleName = "";
			},

			roleFromselsChange: function (sels) {
				this.roleFrom.sels = sels;
			},
			//显示新增角色界面
			handleAddRole: function () {
				this.addRoleVisible = true;
				this.getRole();
			},
			
			batchSave:function(){				
				this.listLoading = true;
				request("/userrole", {
					method: "POST",
					data: {
						userRole : JSON.stringify(this.roleFrom.sels)
					}
				}).then((data) => {
					if (data > 0){
						this.$message({type: 'success', message: "保存成功"})
					}
					this.addRoleVisible = false;
					this.getUserRole();
				}).catch(() => {

				});

				this.listLoading = false;

			},

			//删除
			handleDelete: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					request("/userrole/" + para.id, {
						method: "DELETE",
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getUserRole();
					}).catch()(

					)

				}).catch(() => {

				});

				this.listLoading = false;
			},
			//批量删除
			batchDelete: function () {
				debugger
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
					request("/userrole/" + para.ids, {
						method: "DELETE",
					}).then((data) => {
						if (data > 0){
							this.$message({type: 'success', message: "删除成功"})
						}
						this.getUserRole();
					}).catch()(

					)
					
				}).catch(() => {

				});
			},
			//返回
			back:function() {
				//返回上一层
				this.$router.go(-1);
			}
		},
		
		mounted() {
			this.getUserRole();
		}
	}