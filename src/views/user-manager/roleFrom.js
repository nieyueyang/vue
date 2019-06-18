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
				request("/userrole/" + id + "/" +this.pageNum + "/"+ this.pageSize , {
					method: "GET",

				}).then((data) => {
					debugger
					this.role = data.list;
					this.total = data.total;
					this.pageNum = data.pageNum;
					this.pageSize = data.pageSize;

					this.$nextTick(function() {
						this.toggleSelection(this.role);
					  })

				}).catch(() => {

				});

				this.listLoading = false;
			},
			//默认选中
			toggleSelection(rows) {
				if (rows) {
				  rows.forEach(row => {
					  if (row.userId != ""){
						this.$refs.multipleTable.toggleRowSelection(row, true);
					  }else{
						this.$refs.multipleTable.clearSelection();
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
			batchSave:function(){
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
						this.getUserRole();
					}).catch()(

					)
					
				}).catch(() => {

				});

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
						this.getUserRole();
					}).catch()(

					)
					
				}).catch(() => {

				});
			}
		},
		
		mounted() {
			this.getUserRole();
		}
	}