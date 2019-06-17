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
					<el-button type="primary" size="small" v-on:click="getRole">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="clear">清除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="添加角色" size="small" v-on:click="clear">清除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="role" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column key="1" prop="id" label="id" v-if="false"  width="80" ></el-table-column>
			<el-table-column key="2" prop="roleCode" label="角色编码" width="100" ></el-table-column>
			<el-table-column key="3" prop="roleName" label="角色名称" width="150" sortable></el-table-column>
			<el-table-column key="4" prop="roleType" label="角色类别" width="120" :formatter="formatRoleType" sortable></el-table-column>
			<el-table-column key="5" prop="isactive" label="是否启用" width="100" :formatter="formatIsactive"></el-table-column>
			<el-table-column key="9" label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">授权</el-button>
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

		<!--新增界面-->
		<el-dialog title="新增" customClass="customWidth" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色编码" prop="roleCode">
					<el-col :span="15">
						<el-input type="text" v-model="addForm.roleCode"  size="small"></el-input>
					</el-col>	
				</el-form-item>
				<el-form-item label="角色名称" prop="roleName">
					<el-col :span="15">
						<el-input type="text" v-model="addForm.roleName"  size="small"></el-input>
					</el-col>	
				</el-form-item>
				<el-form-item label="角色类型">
						<el-select v-model="addForm.roleType" placeholder="请选择角色类型">
							<el-option label="业务类" :value="0"></el-option>
							<el-option label="管理类" :value="1"></el-option>
							<el-option label="审计类" :value="2"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="addForm.isactive">
						<el-radio class="radio" :label="0">启用</el-radio>
						<el-radio class="radio" :label="1">停用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" customClass="customWidth" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="id" prop="id" hidden>
					<el-input type="text"  v-model="editForm.id"  size="small"></el-input>
				</el-form-item>

				<el-form-item label="角色编码" prop="roleCode">
					<el-col :span="15">
						<el-input type="text" v-model="editForm.roleCode" readonly="true"  size="small"></el-input>
					</el-col>	
				</el-form-item>
				<el-form-item label="角色名称" prop="roleName">
					<el-col :span="15">
						<el-input type="text" v-model="editForm.roleName"  size="small"></el-input>
					</el-col>	
				</el-form-item>
				<el-form-item label="角色类型">
						<el-select v-model="editForm.roleType" placeholder="请选择角色类型">
							<el-option label="业务类" value="0"></el-option>
							<el-option label="管理类" value="1"></el-option>
							<el-option label="审计类" value="2"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="editForm.isactive">
						<el-radio class="radio" label="0">启用</el-radio>
						<el-radio class="radio" label="1">停用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>



<style scoped> 	
	@import './index.less'; 
</style>
