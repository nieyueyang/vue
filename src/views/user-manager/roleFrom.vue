<script type="text/javascript" src="./roleFrom.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.roleCode" size="small" placeholder="角色编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.roleName" size="small" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getUserRole">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="clear">清除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="handleAddRole">选择角色</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="batchDelete">删除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="back">返回</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="userRole" ref="multipleTable" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column prop="id" label="id" v-if="false" width="80" ></el-table-column>
			<el-table-column prop="userId" label="userId" v-if="false" width="80" ></el-table-column>
			<el-table-column prop="userAccount" label="userAccount" v-if="false"  width="80" ></el-table-column>
			<el-table-column prop="isDelete" label="isDelete" v-if="false" width="80" ></el-table-column>
			<el-table-column prop="roleCode" label="角色编码" width="100" ></el-table-column>
			<el-table-column prop="roleName" label="角色名称" width="150" sortable></el-table-column>
			<el-table-column prop="roleType" label="角色类别" width="120" :formatter="formatRoleType" sortable></el-table-column>
			<el-table-column prop="isactive" label="是否启用" width="100" :formatter="formatIsactive"></el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination background
			@size-change="handleSizeChange" 
			@current-change="handleCurrentChange"  
			layout="prev, pager, next,jumper,sizes,total,slot"
			:current-page="pageNum"
			:page-sizes="[10,20,50,100]"
			:page-size="pageSize"
			:total= "total" 
			style="float:right;">
    	</el-pagination>

		<!--选择角色界面-->
		<el-dialog title="选择角色" customClass="roleView" v-model="addRoleVisible" :close-on-click-modal="false">

					<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="roleFrom.roleCode" size="small" placeholder="角色编码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="roleFrom.roleName" size="small" placeholder="角色名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" v-on:click="getRole">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" v-on:click="clearRole">清除</el-button>
						</el-form-item>
					</el-form>
				</el-col>

					<!--列表-->
				<el-table :data="roleFrom.role" border highlight-current-row v-loading="listLoading" @selection-change="roleFromselsChange" height="250">
					<el-table-column type="selection" width="40"></el-table-column>
					<el-table-column type="index" width="55"></el-table-column>
					<el-table-column key="1" prop="id" label="id" v-if="false"  width="80" ></el-table-column>
					<el-table-column key="2" prop="roleCode" label="角色编码" width="100" ></el-table-column>
					<el-table-column key="3" prop="roleName" label="角色名称" width="150"></el-table-column>
					<el-table-column key="4" prop="roleType" label="角色类别" width="110" :formatter="formatRoleType"></el-table-column>
					<el-table-column key="5" prop="isactive" label="是否启用"  :formatter="formatIsactive"></el-table-column>
				</el-table>

				<el-pagination background
					@size-change="handleSizeChange_role" 
					@current-change="handleCurrentChange_role"  
					layout="prev, pager, next,jumper,sizes,total,slot"
					:current-page="roleFrom.pageNum"
					:page-sizes="[10,20,50,100]"
					:page-size="roleFrom.pageSize"
					:total= "roleFrom.total"
					style="float:right;">
		    	</el-pagination>
	
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addRoleVisible = false">取消</el-button>
				<el-button type="primary" @click.native="batchSave"  :loading="listLoading">保存</el-button>
			</div>
		</el-dialog>

	

	</section>
</template>



<style scoped> 	
	@import './index.less'; 
</style>
