<script type="text/javascript" src="./index.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.systemCode" size="small" placeholder="系统编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.systemName" size="small" placeholder="系统名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getAppSystem">查询</el-button>
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
		<el-table :data="appSystem" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column prop="id" label="id" v-if="false"  width="80" ></el-table-column>
			<el-table-column prop="systemCode" label="系统编码" width="100" ></el-table-column>
			<el-table-column prop="systemName" label="系统名称" width="150"></el-table-column>
			<el-table-column prop="domain" label="域名" width="150"></el-table-column>
			<el-table-column prop="type" label="类别" width="100" :formatter="formatType" ></el-table-column>
			<el-table-column prop="status" label="是否启用" width="100" :formatter="formatStatus"></el-table-column>
			<el-table-column prop="sort" label="排序" width="100"></el-table-column>
			<el-table-column prop="createAccount"  label="创建人编码" v-if="false"></el-table-column>
			<el-table-column prop="createName" label="创建人" width="120" sortable></el-table-column>
			<el-table-column prop="createDate" label="创建时间" :formatter="dateFormat"  width="120"></el-table-column>
			<el-table-column label="操作" fixed="right" width="200">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

				<!--新增/编辑界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-input v-model="addForm.id"  size="small"></el-input>
				<el-row >
					<el-col :span="10" >
						<el-form-item label="系统编码" prop="systemCode">
							<el-input v-model="addForm.systemCode" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="系统名称" prop="systemName">
							<el-input v-model="addForm.systemName" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10">
						<el-form-item label="域名" prop="domain">
							<el-input v-model="addForm.domain" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="排序" prop="sort">
							<el-input v-model="addForm.sort" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="系统类别">
							<el-select v-model="addForm.type" size="small" placeholder="请选择...">
								<el-option label="内部" value="0"></el-option>
								<el-option label="外部" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10" >
						<el-form-item label="是否启用">
							<el-select v-model="addForm.status" size="small" placeholder="请选择...">
								<el-option label="启用" :value="0"></el-option>
								<el-option label="禁用" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="save" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		

	</section>
</template>



<style scoped> 	
	@import './index.less'; 
</style>
