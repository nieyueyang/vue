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
					<el-button type="primary" size="small" v-on:click="batchSave">保存</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="role" ref="multipleTable" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column prop="id" label="id" width="80" ></el-table-column>
			<el-table-column prop="userId" label="userId"  width="80" ></el-table-column>
			<el-table-column prop="userAccount" label="userAccount"  width="80" ></el-table-column>
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

	

	</section>
</template>



<style scoped> 	
	@import './index.less'; 
</style>
