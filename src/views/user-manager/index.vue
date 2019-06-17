<script type="text/javascript" src="./index.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.account" size="small" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" size="small" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="clear">清除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" @click="batchDelete" size="small" :disabled="this.sels.length===0">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column prop="id" label="id" v-if="false" width="80"></el-table-column>
			<el-table-column prop="account" label="用户账号" width="120"></el-table-column>
			<el-table-column prop="name" label="名称" width="150"></el-table-column>
			<el-table-column prop="salt" label="盐" v-if="false" width="120" sortable></el-table-column>
			<el-table-column prop="sex" label="性别" width="70" :formatter="formatSex"></el-table-column>
			<el-table-column prop="birthday" label="生日" width="120" :formatter="dateFormat"></el-table-column>
			<el-table-column prop="phone" label="电话" min-width="120"></el-table-column>
			<el-table-column prop="email" label="电子邮箱" min-width="200"></el-table-column>
			<el-table-column prop="companyId" label="公司" min-width="200"></el-table-column>
			<el-table-column prop="source" label="来源" min-width="80"></el-table-column>
			<el-table-column prop="createAccount" label="创建人编码" v-if="false" min-width="100"></el-table-column>
			<el-table-column prop="createName" label="创建人" min-width="120"></el-table-column>
			<el-table-column prop="createDate" label="创建时间" min-width="110" :formatter="dateFormat"></el-table-column>
			<el-table-column label="操作" fixed="right" width="230">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="showRoleFrom(scope.$index, scope.row)">添加角色</el-button>
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
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-row >
					<el-col :span="10" >
						<el-form-item label="账号" prop="account">
							<el-input v-model="addForm.account" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="addForm.name" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="性别">
							<el-select v-model="addForm.sex" size="small" placeholder="请选择角性别">
								<el-option label="男" :value="0"></el-option>
								<el-option label="女" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="来源" prop="source">
							<el-input v-model="addForm.source" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row >
					<el-col :span="10" >
						<el-form-item label="电话" prop="phone">
							<el-input v-model="addForm.phone" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="电子邮件" prop="email">
							<el-input v-model="addForm.email" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="公司" prop="companyId">
							<el-input v-model="addForm.companyId" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="生日">
							<el-date-picker type="date" size="small" placeholder="选择日期" v-model="addForm.birthday"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="年龄">
							<el-input-number v-model="addForm.age" :min="0" :max="200" size="small"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-input v-model="editForm.id" v-if="false" size="small"></el-input>
				<el-row >
					<el-col :span="10" >
						<el-form-item label="账号" prop="account">
							<el-input v-model="editForm.account" readonly size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="editForm.name" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="性别">
							<el-select v-model="editForm.sex" size="small" placeholder="请选择角性别">
								<el-option label="男" value="0"></el-option>
								<el-option label="女" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="来源" prop="source">
							<el-input v-model="editForm.source" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row >
					<el-col :span="10" >
						<el-form-item label="电话" prop="phone">
							<el-input v-model="editForm.phone" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="电子邮件" prop="email">
							<el-input v-model="editForm.email" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="公司" prop="companyId">
							<el-input v-model="editForm.companyId" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="生日">
							<el-date-picker type="date" size="small" placeholder="选择日期" v-model="editForm.birthday"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="年龄">
							<el-input-number v-model="editForm.age" :min="0" :max="200" size="small"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>


<style scoped>

</style>
